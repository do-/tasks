module.exports = {

    label : 'Пользователи',

    columns : {
        uuid       : 'uuid=uuid_generate_v4()',
        id_role    : '(roles)=2 // Роль',           
        is_deleted : 'int=0     // 1, если удалён', 
        label      : 'string  /^[А-ЯЁ][А-ЯЁа-яё \\-]+[а-яё]$/ // ФИО',
//		label      : {REMARK: 'ФИО', NULLABLE: true, TYPE_NAME: 'string', PATTERN: '^[А-ЯЁ][А-ЯЁа-яё \\-]+[а-яё]$'},
        login      : 'string    // login',             
        mail       : 'string    // E-mail',              
        password   : 'string    // Пароль',             
        salt       : 'string    // "Соль" пароля',
    },
    
    keys : {
        login    : 'UNIQUE (login)',
    },

    data : [
        {uuid: '00000000-0000-0000-0000-000000000000', id_role: 1},
    ],
    
    triggers : {

        before_insert_update : function () {return `

			IF NEW.label IS NOT NULL AND NEW.label !~ '${this.columns.label.PATTERN}' THEN
				RAISE '#label#: Проверьте, пожалуйста, правильность заполнения ФИО';
			END IF;

            RETURN NEW;

        `},

    },

}