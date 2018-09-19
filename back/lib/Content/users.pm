################################################################################

sub do_set_option_users {

	$_USER -> {role} eq 'admin' or die '#foo#:Доступ запрещён';

	my $data = $_REQUEST {data};
	
	my $d = {
		fake    => 0,
		id_user => get_id (),
	};
	
	$d -> {$_} = $data -> {$_} foreach qw (is_on id_voc_user_option);

	sql_do_upsert (user_options => $d);

}

################################################################################

sub do_set_own_option_users {

	my $data = $_REQUEST {data};

	my $voc_user_option = sql (voc_user_options => $data -> {id_voc_user_option});

	$voc_user_option -> {is_own} or die ('Доступ запрещён');

	my $d = {
		fake    => 0,
		id_user => $_USER -> {id},
	};

	$d -> {$_} = $data -> {$_} foreach qw (is_on id_voc_user_option);

	sql_do_upsert (user_options => $d);

}

################################################################################

sub get_own_options_of_users {
	
	my $filter = w2ui_filter ();
	
	push @$filter, ['roles... LIKE' => "% $_USER->{role}->{name} %"];
	push @$filter, [is_own => 1];

	sql ({}, voc_user_options => $filter,
		['user_options(is_on)' => [
			[fake => 0],
			[id_user => $_USER -> {id}],
		]]
	);

}

################################################################################

sub get_options_of_users {

	my $user = sql (users => get_id (), 'roles');
	
	my $filter = w2ui_filter ();
	
	push @$filter, ['roles... LIKE' => "% $user->{role}->{name} %"];

	sql ({}, voc_user_options => $filter,
		['user_options(is_on)' => [
			[fake => 0],
			[id_user => $user -> {id}],
		]]
	);

}

################################################################################

sub do_set_password_users {

	my $data = {};
	
	if ($_USER -> {role} eq 'admin') {

		my $user = sql (users => [
			[uuid  => $_REQUEST {id}],
			[LIMIT => 1],
		]);

		$data -> {id} = $user -> {id};

	}

	$data -> {id} ||= $_USER -> {id};

	my $d = $_REQUEST {data};

	$data -> {salt}     = password_hash (rand, time);
	$data -> {password} = password_hash ($data -> {salt}, $d -> {p1});

	sql_do_update (users => $data);	

}

################################################################################

sub do_create_users {

	my $d = {fake => 0};
	
	$d -> {$_} = $_REQUEST {data} {$_} foreach qw (login label id_role);

	$d -> {id_role} or die '#id_role#: Не указана роль';
	
	$d -> {label} =~ /^[А-ЯЁ][А-ЯЁа-яё\- ]+[а-яё]$/ or die '#label#: Проверьте, пожалуйста, правильность заполнения ФИО';

	$d -> {login} =~ /^[A-Za-z0-9_\.]+$/ or die '#login#: Недопустимый login';

	sql_select_scalar ('SELECT id FROM users WHERE fake = 0 AND login = ?', $d -> {login}) and die '#login#: Этот login уже занят';

	sql (users => sql_do_insert (users => $d));

}

################################################################################

sub do_update_users {

	my $d = {}; $d -> {$_} = $_REQUEST {data} {$_} foreach qw (login label mail);

	$d -> {label} =~ /^[А-ЯЁ][А-ЯЁа-яё\- ]+[а-яё]$/ or die '#label#: Проверьте, пожалуйста, правильность заполнения ФИО';

	$d -> {login} =~ /^[A-Za-z0-9_\.]+$/ or die '#login#: Недопустимый login';

	sql_select_scalar ('SELECT id FROM users WHERE fake = 0 AND login = ? AND id <> ?', $d -> {login}, $data -> {id}) and die '#login#: Этот login уже занят';

	sql_do_update (users => $d, get_id ());

}

################################################################################

sub get_item_of_users {

	sql (users => [
		[fake  => [0, $_REQUEST {sid}]],
		[uuid  => $_REQUEST {id}],
		[LIMIT => 1],
	], 'roles')
	
}

################################################################################

sub select_users {

	$_REQUEST {sort} ||= [{field => "label", direction => "asc"}];

	if ($_REQUEST {searchLogic} eq 'OR') {
		
		my $q = $_REQUEST {search} [0] {value};
	
		$_REQUEST {search} = [
			{field => 'label', operator => 'contains', value => $q},
			{field => 'login', operator => 'contains', value => $q},
			{field => 'mail',  operator => 'contains', value => $q},
		]

	}
	
	my $filter = w2ui_filter ();
	
	push @$filter, ['id > ' => 0];

	sql ({}, users => $filter,
		, 'roles AS role'
	);

}