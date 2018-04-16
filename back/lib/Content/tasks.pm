################################################################################

sub _tasks_get_note {

	my ($d) = @_;
	
	$d -> {label} =~ s{^\s*}{}gsm;
	$d -> {label} =~ s{\s*$}{}gsm;
	
	my @lines = split /[\n\r]+/, delete $d -> {label};

	$d -> {label} = shift @lines;
	
	join "\n", @lines;

}

################################################################################

sub do_comment_tasks {

	my $d = {fake => 0};
	
	$d -> {id_task} = get_id ();

	$d -> {$_} = $_REQUEST {data} {$_} foreach qw (label id_user_to);
	
	$d -> {id_user_to} > 0 or $d -> {id_user_to} = undef;
	
	$d -> {body} = _tasks_get_note ($d);	
	
	sql_do_insert (task_notes => $d);

	send_mail ({
		to           => $d -> {id_user_to},
		subject      => $d -> {label},
		text         => $d -> {body},
		href         => "/tasks/$_REQUEST{id}",
	});

}

################################################################################

sub do_create_tasks {

	my $d = {fake => 0};
	
	$d -> {$_} = $_REQUEST {data} {$_} foreach qw (label id_user);

	$d -> {id_user} or die '#id_user#: Не указан адресат';
	
	my $note = _tasks_get_note ($d);	

	my $id_task = sql_do_insert (tasks => $d);
	
	sql_do_insert (task_notes => {
		fake	   => 0,
		id_task	   => $id_task,
		id_user_to => $d -> {id_user},
		label	   => $d -> {label},
		body	   => $note,
	});

	sql_do_insert (task_users => {
		fake	   => 0,
		id_task	   => $id_task,
		id_user    => $_USER -> {id},
		is_author  => 1,
	});

	sql_do_insert (task_users => {
		fake	   => 0,
		id_task	   => $id_task,
		id_user    => $d -> {id_user},
		is_author  => 0,
	});

	my $data = sql (tasks => $id_task);
	
	eval {

		send_mail ({
			to           => $d -> {id_user},
			subject      => $d -> {label},
			text         => $note,
			href         => "/tasks/$data->{uuid}",
		});

	};
	
	darn $@ if $@;
	
	$data;
	
}

################################################################################

sub get_item_of_tasks {

	my $data = sql (tasks => get_id ());

	my %u = ();

	sql (task_users => [

		[id_task => $data -> {id}],

	], 'users', sub {

		my $u = $i -> {user};

		$data -> {$i -> {is_author} ? 'author' : 'executor'} = $i -> {user};

		$u {$u -> {id}} = $u;
	
	});

	$data -> {users} = [sort {$a -> {label} cmp $b -> {label}} values %u];

	sql ($data, task_notes => [
		[id_task => $data -> {id}],
		[ORDER   => 'id'],
	]);

	$data;

}

################################################################################

sub get_vocs_of_tasks {
	
	add_vocabularies ({}, users => {filter => 'id > 0'});
	
}

################################################################################

sub select_tasks {

	$_REQUEST {sort} = [{field => "id", direction => "asc"}];
	
	my $note = undef;
	my $status = undef;
	my $id_other_user = undef;
	my $is_author = undef;

	if ($_REQUEST {searchLogic} eq 'OR') {
		
		$note = $_REQUEST {search} [0] {value};
		
		$_REQUEST {search} = [];
	
	}
	else {
	
		my @r = ();
		
		foreach my $s (@{$_REQUEST {search}}) {
		
			if ($s -> {field} eq 'note') {

				$note = $s -> {value};

			}
			elsif ($s -> {field} eq 'status') {

				$status = $s -> {value};

			}
			elsif ($s -> {field} eq 'id_other_user') {

				$id_other_user = $s -> {value};

			}
			elsif ($s -> {field} eq 'is_author') {

				$is_author = $s -> {value} == 1 ? 1 : 0;

			}
			else {

				push @r, $s;

			}
		
		}

		$_REQUEST {search} = \@r;

	}
	
	my $filter = w2ui_filter ();
	
	if ($status) {
	
		push @$filter, $status == 1 ? ['id_user IS NOT NULL'] : ['id_user IS NULL'];
	
	}

	if ($note) {
	
		push @$filter, [id => sql ('task_notes(id_task)' => [['label ILIKE %?% OR body ILIKE %?%' => [$note, $note]]])]
	
	}

	if ($id_other_user) {
	
		push @$filter, [id => sql ('task_users(id_task)' => [
			[id_user => [map {$_ -> {id}} @$id_other_user]],
			[is_author => $is_author],
		])]
	
	}

	sql ({}, tasks => $filter,
		, 'task_notes(*) ON id_last_task_note'
	);

}