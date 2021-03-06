module.exports = {

    label : 'Опции пользователей',

    columns : {
        id_user            : '(users)            // Пользователь', 
        id_voc_user_option : '(voc_user_options) // Опция', 
    },

    pk : ['id_user', 'id_voc_user_option'],
    
    sql : `
    
        SELECT
        	id_user,
        	id_voc_user_option,
        	1 is_on
        FROM
            user_options

    `,

}