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

    ],

}