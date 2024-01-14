module.exports = {

    label : 'Корреспонденты',

    columns : {
        id_user            : '(users) // Пользователь',            
        id_user_ref        : '(users) // Корреспондент',           
    },

    pk : ['id_user', 'id_user_ref'],

}