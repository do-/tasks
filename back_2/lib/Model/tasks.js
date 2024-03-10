module.exports = {

    label : 'Дела',

    columns : {

        uuid               : 'uuid=uuid_generate_v4()',

        id_user_author     : "(users)! // Автор",
        id_user_executor   : "(users)! // Адресат",
        id_user            : "(users)  // У кого на рассмотрении",

        label              : "text // Тема",

        ts                 : "timestamp=now() // Когда оформлено",

        id_last_task_note  : "(task_notes) // Последняя реплика",

        id_voc_project     : "(voc_projects) // Проект",

    },

    pk: 'uuid',

    keys : {
        id_user: 'id_user',
    },


    triggers: [

    	{
			phase  : 'BEFORE INSERT',
			action : 'FOR EACH ROW',
			sql    : /*sql*/`
				BEGIN
                    NEW.id_user_executor = NEW.id_user_author;
                    NEW.id_user          = NEW.id_user_author;
                    RETURN NEW;
				END;
			`,
    	},

    	{
			phase  : 'AFTER INSERT',
			action : 'FOR EACH ROW',
			sql    : /*sql*/`
				BEGIN
                    INSERT INTO task_users (id_task, id_user, is_author) VALUES (NEW.uuid, NEW.id_user_author, 1);
                    INSERT INTO task_users (id_task, id_user, is_author) VALUES (NEW.uuid, NEW.id_user_executor, 0);
                    RETURN NEW;
				END;
			`,
    	},

    	{
			phase  : 'AFTER UPDATE',
			action : 'FOR EACH ROW WHEN (NEW.id_user_executor <> OLD.id_user_executor)',
			sql    : /*sql*/`
				BEGIN

                    IF NEW.id_user_author <> OLD.id_user_executor THEN
                        RAISE '#_#:Исполнитель этой задачи уже был назначен';
                    END IF;

                    UPDATE task_users SET id_user    = NEW.id_user_executor WHERE id_task = NEW.uuid AND is_author = 0;
                    UPDATE task_notes SET id_user_to = NEW.id_user_executor WHERE id_task = NEW.uuid;

                    IF NEW.id_user_author <> NEW.id_user_executor THEN
                        PERFORM pg_notify ('mail', NEW.uuid::TEXT);
                    END IF;

                    RETURN NEW;

				END;
			`,
    	},

        {
			phase  : 'AFTER UPDATE',
			action : 'FOR EACH ROW WHEN (NEW.id_user <> OLD.id_user)',
			sql    : /*sql*/`
				BEGIN
                    PERFORM pg_notify ('mail', NEW.uuid::TEXT);
                    RETURN NEW;
				END;
			`,
    	},

    ],

}