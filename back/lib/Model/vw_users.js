module.exports = {

    label: 'Активные пользователи + роли',

    columns: {

        label              : "text // Имя", 
        role               : "text // Роль", 

    },

    sql : `
    
        SELECT
            users.uuid
            , users.label
            , roles.name AS role
        FROM
            users
            INNER JOIN roles ON users.id_role = roles.id
        WHERE
        	users.is_deleted = 0

    `,

}