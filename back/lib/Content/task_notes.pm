################################################################################

sub get_vocs_of_task_notes {
	
	add_vocabularies ({}, users => {filter => 'id > 0'});
	
}

################################################################################

sub select_task_notes {

	$_REQUEST {sort} = [{field => "id", direction => "asc"}];
	
	my $note = undef;
	
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
			else {

				push @r, $s;

			}
		
		}

		$_REQUEST {search} = \@r;

	}
	
	my $filter = w2ui_filter ();

	if ($note) {
	
		push @$filter, ['label ILIKE %?% OR body ILIKE %?%' => [$note, $note]];
	
	}

	sql ({}, task_notes => $filter,
		'tasks(uuid)'
	);

}