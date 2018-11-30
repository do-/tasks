################################################################################

sub get_vocs_of_task_notes {
	
	add_vocabularies ({}, users => {filter => 'id > 0'});
	
}

################################################################################

sub select_task_notes {

	$_REQUEST {sort} = [{field => "id", direction => "desc"}];
	
	my $note = undef;
	my $status = undef;
	
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

		['-tasks(uuid) ON task_notes.id_task' => [
			$status ==  1 ? ['id_user IS NOT NULL'] :
			$status == -1 ? ['id_user IS NULL'] :
			[]
		]]

	);

}