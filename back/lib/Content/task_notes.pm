################################################################################

sub get_vocs_of_task_notes {
	
	add_vocabularies ({}, users => {filter => 'id > 0'});
	
}

################################################################################

sub select_task_notes {

	$_REQUEST {sort} = [{field => "id", direction => "asc"}];
	
	if ($_REQUEST {searchLogic} eq 'OR') {
		
		$note = $_REQUEST {search} [0] {value};
		
		$_REQUEST {search} = [];
	
	}
	
	my $filter = w2ui_filter ();

	if ($note) {
	
		push @$filter, ['label ILIKE %?% OR body ILIKE %?%' => [$note, $note]];
	
	}

	sql ({}, task_notes => $filter,
	);

}