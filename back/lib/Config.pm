use Digest::SHA;
use File::Path;

$preconf -> {auth} -> {sessions} -> {cookie} = {
	name => 'session_id',
	path => '/_back',
};

our $conf = {
	
	portion => 2,
		
	sql_features => ['idx.partial'],
		
};

#################################################################################

sub password_hash {

	my ($salt, $password) = @_;
	
	my $sha = Digest::SHA -> new (256);
	
	$sha -> addfile ($preconf -> {auth} -> {salt_file});

	$sha -> add ($salt);

	$sha -> add (Encode::encode ('UTF-8', $password));
	
	my $result = $sha -> hexdigest;

	return $result;

}

#################################################################################

sub check_session {

#	if ($ENV {REMOTE_ADDR} eq $ENV {SERVER_ADDR}) {
	
#		$_REQUEST {sid} = 1;

#		our $_USER = sql (users => -2);

#	}
#	else {

		our $_USER = get_user ();

		if (!$_USER -> {id} && ($_REQUEST {type} ne 'sessions')) {

			$_HEADERS -> header (Status => 401);

			send_http_header ();

		}	

#	}
	
	unless ($preconf -> {_} -> {roles_cache}) {
	
		$preconf -> {_} -> {roles_cache} -> {$_ -> {id}} = $_ -> {name} foreach @{$DB_MODEL -> {tables} -> {roles} -> {data}};
	
	}
	
	$_USER -> {role} = $preconf -> {_} -> {roles_cache} -> {$_USER -> {id_role}};
	
}

#################################################################################

sub get_data_source_name {

	return 'get_' . $_REQUEST {part} . '_of_' . $_REQUEST {type} if $_REQUEST {part};

	return 'get_item_of_' . $_REQUEST {type} if $_REQUEST {id};

	return 'select_' . $_REQUEST {type};

}

#################################################################################

sub get_page_data {

	require_content ($_REQUEST {type});

	$_REQUEST {action} or return call_for_role (get_data_source_name ());
	
	my $sub_name = "do_$_REQUEST{action}_$_REQUEST{type}";
	
	$db -> {AutoCommit} = 0;
	
	sql_do (q {SELECT set_config ('tasks.id_user', ?, true)}, $_USER -> {id}) if $_USER -> {id};
			
	my $data = call_for_role ($sub_name);
		
	call_for_role ("recalculate_$_REQUEST{type}");
		
	return $data;

}

#################################################################################

sub handle_valid_request {

	$_HEADERS -> header (Status => 200);

	my $page = {success => \1};

	eval {

		$db = $preconf -> {_} -> {own_db} if $preconf -> {_} -> {own_db};
		
		sql_reconnect ();

		check_session (); $_HEADERS -> header ('Status') eq 200 or return;

		$page -> {content} = get_page_data () if $_REQUEST {type};

	};
	
	if ($@) {
	
		$db -> {AutoCommit} or $db -> rollback ();
	
		$page -> {success} = \0;
	
		if ($@ =~ /^\#(.*?)\#\:/) {

			$page -> {field}   = $1;
			$page -> {message} = $';
			$page -> {message} =~ s{ at .*}{}gsm;

			$_HEADERS -> header (Status => 422);

		}
		else {

			my $time = time;

			my ($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst) = localtime ($time);
darn ($@);
			$page -> {id} = Digest::MD5::md5_hex ($$ . $@ . $time . rand ());

			$page -> {dt} = sprintf ('%04d-%02d-%02d %02d:%02d:%02d.%03d', $year + 1900, $mon + 1, $mday, $hour, $min, $sec, 1000 * ($time - int $time));

			warn "[$page->{dt} $$]\t$page->{id}\t$@\n";

			$h -> {dt} =~ y{ }{T};
			
			$_HEADERS -> header (Status => 500);
			
		}
	
	}
	else {

		$db -> {AutoCommit} or $db -> commit ();

	}
	
	if ($_REQUEST {__suicide}) {
	
		warn "[$$] \$_REQUEST{__suicide} is set; exiting\n";

		sql_disconnect ();
		
		exit (0);
	
	}
	else {

		out_json $page;

	}
	
}

#################################################################################

sub handler {

	our @_PROFILING_STACK = ();

	__profile_in ('handler.request');
		
	is_request_ok (@_) and handle_valid_request ();
	
	__profile_out ('handler.request' => {label => "type='$_REQUEST{type}' id='$_REQUEST{id}' action='$_REQUEST{action}' part='$_REQUEST{part}' id_user='$_USER->{id}'"});

}

################################################################################

my %w2ui_op = (
	is       => ' = ?',
	less     => ' <= ?',
	more     => ' >= ?',
	between  => ' BETWEEN ? AND ?',
	begins   => ' ILIKE ?%',
	ends     => ' ILIKE %?',
	contains => ' ILIKE %?%',
	in       => ' IN ',
	'not in' => ' NOT IN ',
	null     => ' IS NULL ',
);

sub w2ui_filter {

	my @filter = ();

	if ($_REQUEST {search}) {

		foreach my $s (@{$_REQUEST {search}}) {
		
			$s -> {expr} = $s -> {field} . $w2ui_op {$s -> {operator}};
			
			my $ref = ref $s -> {value};
			
			if (!$ref) {

				$s -> {value} =~ s{^\s+}{};
				$s -> {value} =~ s{\s+$}{};

				$s -> {value} =~ y{*}{%} if $s -> {expr} =~ /LIKE/;
				
				$s -> {value} = dt_iso ($s -> {value}) if $s -> {type} eq 'date';

			}
			elsif ($ref eq ARRAY) {
			
				$s -> {value} = [map {ref $_ eq HASH ? $_ -> {id} : $_} @{$s -> {value}}];

				$s -> {value} = [map {dt_iso ($_)} @{$s -> {value}}] if $s -> {type} eq 'date';
			
			}

		}

		if ($_REQUEST {searchLogic} eq 'AND') {
		
			push @filter, map {[$_ -> {expr} => $_ -> {value}]} @{$_REQUEST {search}};

		}
		elsif ($_REQUEST {searchLogic} eq 'OR') {
		
			my (@l, @r) = ();
			
			foreach my $s (@{$_REQUEST {search}}) {
				next if $s -> {type} eq 'date' and $s -> {value} !~ /^\d\d\d\d-\d\d-\d\d$/;
				push @l, $s -> {expr};
				push @r, $s -> {value};
			}
			
			my $l = join ' OR ', map {"($_)"} @l;

			push @filter, [$l, \@r];

		}
	
	}

	push @filter, [LIMIT => [$_REQUEST {offset}, $_REQUEST {limit}]];
	
	if ($_REQUEST {sort}) {
	
		push @filter, [ORDER => (join ',', map {$_ -> {field} . ' ' . uc ($_ -> {direction})} @{$_REQUEST {sort}})];
	
	}
	
	\@filter;

}

#################################################################################

sub get_id {

	my ($table, $uuid) = @_;
	
	$table ||= $_REQUEST {type};
	$uuid  ||= $_REQUEST {id};
	
	my $id = sql_select_scalar ("SELECT id FROM $table WHERE uuid = ? AND fake IN (0, ?)", $uuid, $_REQUEST {sid});
	
	$id or die "$table UUID = '$uuid' not found\n";
	
	return $id;

}

1;