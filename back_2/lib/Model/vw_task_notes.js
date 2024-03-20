module.exports = {

    label : 'Реплики',

    columns : {

        uuid               : 'uuid=uuid_generate_v4()',

        id_task            : "(vw_tasks) // Дело",
        ts                 : 'timestamp=now() // Дата/время',

        id_user_from       : "(users)=current_setting('tasks.id_user')::uuid // Автор",
        id_user_to         : "(users) // Адресат",

        label              : "text // Заголовок",
        body               : "text // Текст сообщения",
        txt                : "text // Полный текст",

        is_illustrated     : 'int=0 // Есть ли картинка', 
        ext                : "text // Расширение файла",
        path               : "text // Путь к файлу",

        id_voc_project     : "(voc_projects) // Проект",
        task_label         : "text // Тема",
        is_open            : 'bool // Открыто ли (0 — закрыто, 1 — в работе)',

        mail_content       : "jsonb // Содержимое для извещения",

    },

    pk: 'uuid',

	sql: /*sql*/ `
	
		SELECT
			tn.*,
			t.label AS task_label, 
			t.id_voc_project,
			t.is_open,
            JSONB_BUILD_OBJECT (
                'label', tn.label, 
                'body',  tn.body
            ) mail_content
		FROM
			task_notes tn
			JOIN vw_tasks t ON tn.id_task = t.uuid
		
	`,

}