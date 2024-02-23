module.exports = {

    label : 'Пользователи',

    columns : {
        uuid       : 'uuid',
        id_role    : '(roles)=2                                 // Роль',           
        is_deleted : 'int=0                                     // 1, если удалён', 
        label      : 'text      /^[А-ЯЁ][А-ЯЁа-яё \\-]+[а-яё]$/ // ФИО',
        login      : 'text      /^[A-Za-z0-9_\.]+$/             // login',             
        mail       : 'text                                      // E-mail',              
        password   : 'text                                      // Пароль',             
        salt       : 'text                                      // "Соль" пароля',
    },

    pk: 'uuid',

    keys: {

        ix_users_login: null,

        u_login: {
            parts: ['login'],
            options:  [
                'UNIQUE',
                'WHERE is_deleted = 0',
            ],
            message: e => `#login#: login "${/\(login\)=\((.*?)\)/.exec (e.detail) [1]}" уже занят`,
        },

    },

    triggers: [

    	{
			phase  : 'AFTER UPDATE',
			action : 'FOR EACH ROW',
			sql    : /*sql*/`
				BEGIN
                    IF OLD.is_deleted = 0 AND NEW.is_deleted = 1 THEN
                        DELETE FROM user_users WHERE id_user_ref = NEW.uuid;
                    END IF;
					RETURN NEW;
				END;
			`,
    	},

    ],


/*    
    triggers : {

        before_insert_update : function () {

			return this.model.trg_check_column_values (this) + 'RETURN NEW;'

        },

    },
*/
}