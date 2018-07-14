label => 'Реплики',

columns => {

	uuid               => 'uuid=uuid_generate_v4()',

	id_task            => "(tasks)", # Дело
	ts                 => 'timestamp=current_timestamp()',   # Дата/время

	id_user_from       => "(users)=current_setting('tasks.id_user')::int", # Автор
	id_user_to         => "(users)", # Адресат
	
	label              => "text", # Заголовок
	body               => "text", # Текст
	
	is_illustrated     => 'int=0',  # Есть ли картинка

},

keys => {
	uuid    => 'uuid',
	id_task => 'id_task,id',
	id_user => 'id_user_from,ts',
},

triggers => {

	after_insert => q {
	
		UPDATE 
			tasks 
		SET 
			id_last_task_note = NEW.id,
			id_user = NEW.id_user_to
		WHERE 
			id = NEW.id_task;

		RETURN NEW;

	},

},