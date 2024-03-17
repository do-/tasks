module.exports = {

    label : 'Реплики',

    columns : {

        uuid               : 'uuid=uuid_generate_v4()',

        id_task            : "(vw_tasks) // Дело",
        ts                 : 'timestamp=now() // Дата/время',

        id_user_from       : "(users)! // Автор",
        id_user_to         : "(users)  // Адресат",

        label              : "text // Заголовок",
        body               : "text // Текст сообщения",
        txt                : "text // Полный текст",

        is_html            : 'bool=1 // HTML ли это',

//        is_illustrated     : 'int=0 // Есть ли картинка', 
//        ext                : "text // Расширение файла",
//        path               : "text // Путь к файлу",

    },

    pk: 'uuid',

    keys : {
        id_task : ['id_task',      'ts'],
        id_user : ['id_user_from', 'ts'],
    },

    triggers: [

    	{
			phase  : 'AFTER INSERT',
			action : 'FOR EACH ROW',
			sql    : /*sql*/`
				BEGIN

                    UPDATE 
                        tasks 
                    SET 
                        id_last_task_note = NEW.uuid,
                        id_user = NEW.id_user_to
                    WHERE 
                        uuid = NEW.id_task;
                        
                    INSERT INTO task_tasks (
                        id_task,
                        id_task_to
                    )
                    SELECT t.* FROM (
                        SELECT DISTINCT
                            NEW.id_task
                            , RIGHT((REGEXP_MATCHES (NEW.label || NEW.body, 'tasks/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}', 'g'))[1], 36)::uuid id_task_to
                    ) t INNER JOIN tasks ON t.id_task = tasks.uuid 
                        WHERE t.id_task_to <> t.id_task
                    ON CONFLICT DO NOTHING;

                    RETURN NEW;

				END;
			`,
    	},

        {
			phase  : 'BEFORE INSERT',
			action : `FOR EACH ROW WHEN (NEW.id_user_to <> current_setting ('app.user')::UUID)`,
			sql    : /*sql*/`
				BEGIN
                    PERFORM notify_on_task (NEW.id_task);
                    RETURN NEW;
				END;
			`,
    	},

    ],

}