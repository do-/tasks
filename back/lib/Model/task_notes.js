module.exports = {

    label : 'Реплики',

    columns : {

        uuid               : 'uuid=uuid_generate_v4()',

        id_task            : "(tasks) // Дело",
        ts                 : 'timestamp=now() // Дата/время',

        id_user_from       : "(users)=current_setting('tasks.id_user')::uuid // Автор",
        id_user_to         : "(users) // Адресат",

        label              : "text // Заголовок",
        body               : "text // Текст сообщения",
        txt                : "text // Полный текст",

        is_illustrated     : 'int=0 // Есть ли картинка', 
        is_html            : 'bool=0 // HTML ли это', 
        ext                : "text // Расширение файла",
        path               : "text // Путь к файлу",

    },

    keys : {
        uuid    : 'uuid',
        id_task : 'id_task,ts',
        id_user : 'id_user_from,ts',
    },

    triggers : {

        after_insert : `

            UPDATE 
                tasks 
            SET 
                id_last_task_note = NEW.uuid,
                id_user = NEW.id_user_to
            WHERE 
                uuid = NEW.id_task;
                
            INSERT INTO task_tasks (
                id_task,
                id_task_to
            )
            SELECT t.* FROM (
                SELECT DISTINCT
                    NEW.id_task
                    , RIGHT((REGEXP_MATCHES (NEW.label || NEW.body, 'tasks/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}', 'g'))[1], 36)::uuid id_task_to
            ) t INNER JOIN tasks ON t.id_task = tasks.uuid 
            	WHERE t.id_task_to <> t.id_task
            ON CONFLICT DO NOTHING;

            RETURN NEW;

        `,

    },
    
    on_after_add_column: {
    
        path: [
            {sql: "UPDATE task_notes SET path = TO_CHAR(ts, 'YYYY/MM/DD/') || uuid || '.' || COALESCE (ext, 'png') WHERE is_illustrated = 1", params: []}
        ],

        txt: [
            {sql: "UPDATE task_notes SET txt = CONCAT_WS (' ', label, body)", params: []}
        ],
    
    }

}