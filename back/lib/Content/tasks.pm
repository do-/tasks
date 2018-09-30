################################################################################

sub _tasks_get_note {

	my ($d) = @_;
	
	$d -> {label} =~ s{^\s*}{}gsm;
	$d -> {label} =~ s{\s*$}{}gsm;
	
	my @lines = split /[\n\r]+/, delete $d -> {label};

	$d -> {label} = shift @lines;
	
	join "\n", @lines;

}

#################################################################################

sub _tasks_illustrate {

	my ($id, $img) = @_;
	
	$img or return undef;

	my $data = sql (task_notes => $id);

	my $path = sprintf ('%04d/%02d/%02d', Date::Calc::Today ());

	my $abs_path = $preconf -> {pics} . '/' . $path;

	File::Path::make_path ($abs_path);
	
	my $attach = {real_path => "$abs_path/$data->{uuid}.png"};

	open (F, ">$attach->{real_path}") or die "Can't write to $fn:$!\n";
	binmode F;
	print F MIME::Base64::decode ($img);
	close (F);
	
	return $attach;

}

################################################################################

sub do_comment_tasks {

	my $d = {fake => 0};

	$d -> {id_task} = get_id ();

	$d -> {$_} = $_REQUEST {data} {$_} foreach qw (label id_user_to img);

	$d -> {id_user_to} > 0 or $d -> {id_user_to} = undef;

	$d -> {body} = _tasks_get_note ($d);

	my $img = delete $d -> {img};

	$d -> {is_illustrated} = 1 if $img;

	my $id_task_note = sql_do_insert (task_notes => $d);
	
	my $attach = _tasks_illustrate ($id_task_note, $img);

	eval {

		send_mail ({
			to           => $d -> {id_user_to},
			subject      => $d -> {label},
			text         => "$_USER->{label} пишет:\n\n$d->{body}",
			href         => "/tasks/$_REQUEST{id}",
			attach       => $attach,
		});

	} if $d -> {id_user_to} and $d -> {id_user_to} ne $_USER -> {id};

	darn $@ if $@;	

}

################################################################################

sub do_assign_tasks {

	my $d = {fake => 0};

	$d -> {id_task} = get_id ();

	$d -> {$_} = $_REQUEST {data} {$_} foreach qw (label id_user_to img);

	$d -> {id_user_to} > 0 or die '#id_user_to#: Не указан адресат';

	$d -> {body} = _tasks_get_note ($d);

	my $img = delete $d -> {img};

	$d -> {is_illustrated} = 1 if $img;
	
	sql_do ('UPDATE task_users SET id_user = ? WHERE id_task = ? AND is_author = 0', $d -> {id_user_to}, $d -> {id_task});

	sql_do ('UPDATE task_notes SET id_user_to = ? WHERE id_task = ?', $d -> {id_user_to}, $d -> {id_task});

	my $id_task_note = sql_do_insert (task_notes => $d);

	my $mail = {
		to           => $d -> {id_user_to},
		text         => "$_USER->{label} пишет:\n",
		href         => "/tasks/$_REQUEST{id}",
		attach       => [],
	};

	sql_select_loop ('SELECT * FROM task_notes WHERE id_task = ? ORDER BY id', sub {
	
		if ($mail -> {subject}) {

			$mail -> {text} .= "$i->{label}\n$i->{body}\n";

		}
		else {
		
			$mail -> {subject} = $i -> {label};
			
			$mail -> {text} .= "$i->{body}\n";
		
		}
		
		$i -> {is_illustrated} or next;
		
		my $path = sprintf ('%04d/%02d/%02d', (split /\D/, $i -> {ts}));
		
		push @{$mail -> {attach}}, {real_path => "$preconf->{pics}/$path/$i->{uuid}.png"};

	}, $d -> {id_task});

	eval {send_mail ($mail)};

	darn $@ if $@;

}

################################################################################

sub do_create_tasks {

	my $d = {fake => 0};
	
	$d -> {$_} = $_REQUEST {data} {$_} foreach qw (label id_user);

	$d -> {id_user} = $_USER -> {id};
	
	my $id_task = sql_do_insert (tasks => $d);
	
	$d -> {$_} = $_REQUEST {data} {$_} foreach qw (body img);

	my $img = delete $d -> {img};

	my $id_task_note = sql_do_insert (task_notes => {
		fake	   => 0,
		id_task	   => $id_task,
		id_user_to => $d -> {id_user},
		label	   => $d -> {label},
		body	   => $d -> {body},
		is_illustrated => $img ? 1 : 0,
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
	
	my $attach = _tasks_illustrate ($id_task_note, $img);

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