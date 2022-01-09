module.exports = {

    label : 'Реплики',

    columns : {

        uuid               : 'uuid=uuid_generate_v4()',

        id_task            : "(tasks) // Дело",
        ts                 : 'timestamp=now() // Дата/время',

        id_user_from       : "(users)=current_setting('tasks.id_user')::uuid // Автор",
        id_user_to         : "(users) // Адресат",

        label              : "text // Заголовок",
        body               : "text // Текст",

        is_illustrated     : 'int=0 // Есть ли картинка', 
        ext                : "text // Расширение файла",
        path               : "text // Путь к файлу",

        id_voc_project     : "(voc_projects) // Проект",
        task_label         : "text // Тема",

    },

	sql: `
	
		SELECT
			tn.*,
			t.label AS task_label, 
			t.id_voc_project
		FROM
			task_notes tn
			JOIN tasks t ON tn.id_task = t.uuid
		
	`,

}