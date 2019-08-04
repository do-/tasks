module.exports = {

    label: 'Дела + пользователи',

    columns: {

        id_user             : "(users) // У кого на рассмотрении",
        id_user_author      : "(users)=current_setting('tasks.id_user')::uuid // Автор (uuid)",
        id_user_executor    : "(users)=current_setting('tasks.id_user')::uuid // Адресат (uuid)",

        label               : "text // Тема", 

        ts                  : "timestamp=now() // Когда оформлено",

        id_last_task_note   : "(task_notes) // Последняя реплика",

        user_author_label   : "text // Автор (имя)", 
        user_executor_label : "text // Адресат (имя)",
        
        is_open             : 'int=0 // Статус (0 — закрыто, 1 — в работе)', 

    },

    sql : `
    
        SELECT
            tasks.*
            , a.label AS user_author_label
            , e.label AS user_executor_label
            , CASE WHEN id_user IS NULL then 0 ELSE 1 END AS is_open
        FROM
            tasks
            INNER JOIN users AS a ON tasks.id_user_author = a.uuid
            INNER JOIN users AS e ON tasks.id_user_executor = e.uuid       

    `,

}