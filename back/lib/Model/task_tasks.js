module.exports = {

    label : 'Связи между делами',

    columns : {
        id_task      : '(tasks) // Дело, откуда ссылка',            
        id_task_to   : '(tasks) // Дело, куда ссылка',           
    },

    keys : {
        id_task      : 'UNIQUE (id_task,id_task_to)',
        id_task_back : '(id_task_to,id_task)',
    },
    
    on_after_add_table: {
    
        sql: `
        
            INSERT INTO task_tasks (
                id_task,
                id_task_to
            )
            SELECT t.* FROM (
                SELECT DISTINCT
                    id_task
                    , RIGHT((REGEXP_MATCHES (label || body, 'tasks/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}', 'g'))[1], 36)::uuid id_task_to
                FROM 
                    task_notes
            ) t INNER JOIN tasks ON t.id_task = tasks.uuid

        `, params: []
    
    }
    

}