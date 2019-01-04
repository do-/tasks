module.exports = {

    label : 'Пользователи',

    columns : {

        id_role            : '(roles)=2 // Роль',           
        login              : 'string // login',             
        mail               : 'string // E-mail',              
        password           : 'string // Пароль',             
        salt               : 'string // "Соль" пароля',             
        is_read_only       : 'checkbox // Без права редактирования',           

    },

    keys : {
        uuid               : 'uuid',                
    },

    data : [
        {id : -2, fake : 0, id_role : 1, label : 'Системный процесс'},
        {id : -1, fake : 0, id_role : 1},
    ]

}