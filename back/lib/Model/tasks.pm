label => 'Дела',

columns => {

	uuid               => 'uuid=uuid_generate_v4()',

	id_user            => "(users)", # У кого на рассмотрении
	
	label              => "text", # Тема

	ts                 => 'timestamp=current_timestamp()',   # Когда оформлено

	id_last_task_note  => "(task_notes)", # Последняя реплика

},

keys => {
	uuid    => 'uuid',
	id_user => 'id_user',
},