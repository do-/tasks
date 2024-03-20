module.exports = {

    label: 'Активные пользователи + роли',

    columns: {

        label              : "text  // Имя", 
        role               : "text  // Роль", 
        mail_to            : "jsonb // Адрес для извещения",

    },

    sql : /*sql*/`
    
        SELECT
            t.uuid
            , t.label
            , roles.name AS role
            , JSONB_BUILD_OBJECT (
                'name',     t.label,
                'address',  t.mail
            ) AS mail_to
        FROM
            users t
            INNER JOIN roles ON t.id_role = roles.id
        WHERE
        	t.is_deleted = 0

    `,

}