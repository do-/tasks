module.exports = {

    label : 'Пользователи',

    columns : {
        uuid       : 'uuid=uuid_generate_v4()',
        id_role    : '(roles)=2                                   // Роль',           
        is_deleted : 'int=0                                       // 1, если удалён', 
        label      : 'string [30] /^[А-ЯЁ][А-ЯЁа-яё \\-]+[а-яё]$/ // ФИО',
        login      : 'string      /^[A-Za-z0-9_\.]+$/             // login',             
        mail       : 'string                                      // E-mail',              
        password   : 'string                                      // Пароль',             
        salt       : 'string                                      // "Соль" пароля',
    },
    
    keys : {
        login    : 'UNIQUE (login)',
    },

    data : [
        {uuid: '00000000-0000-0000-0000-000000000000', id_role: 1},
    ],
    
    triggers : {

        before_insert_update : function () {
        
        	let check = (col) => {
        		return `
					IF NEW.${col} IS NOT NULL AND NEW.${col} !~ '${this.columns[col].PATTERN}' THEN
						RAISE '#${col}#: Проверьте, пожалуйста, правильность заполнения поля "${this.columns[col].REMARK}"';
					END IF;
        		`
        	}        
        
        return `

			${check ('label')}			
			${check ('login')}

            RETURN NEW;

        `},

    },

}