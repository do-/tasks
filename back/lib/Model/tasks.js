module.exports = {

    label: 'Дела',

    columns: {

        id_user            : "(users) // У кого на рассмотрении",
        id_user_author     : "(users)=current_setting('tasks.id_user')::uuid // Автор",
        id_user_executor   : "(users)=current_setting('tasks.id_user')::uuid // Адресат",

        label              : "text // Тема", 

        ts                 : "timestamp=now() // Когда оформлено",

        id_last_task_note  : "(task_notes) // Последняя реплика",

        id_voc_project     : "(voc_projects) // Проект",

    },

    keys : {
        uuid    : 'uuid',
        id_user : 'id_user',
    },
    
    on_after_add_column: {
    
        id_user_author: [
            {sql: "UPDATE tasks SET id_user_author = t.id_user FROM (SELECT * FROM task_users WHERE is_author=1) t WHERE tasks.uuid=t.id_task", params: []}
        ],
        
        id_user_executor: [
            {sql: "UPDATE tasks SET id_user_executor = t.id_user FROM (SELECT * FROM task_users WHERE is_author=0) t WHERE tasks.uuid=t.id_task", params: []}
        ],
    
    }

}