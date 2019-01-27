module.exports = {

    label : 'Реплики',

    columns : {

        fake               : "int",

        uuid               : 'uuid=uuid_generate_v4()',

        id_task            : "(tasks) // Дело",
        ts                 : 'timestamp=now() // Дата/время',

        id_user_from       : "(users)=current_setting('tasks.id_user')::int // Автор",
        id_user_to         : "(users) // Адресат",

        label              : "text // Заголовок",
        body               : "text // Текст",

        is_illustrated     : 'int=0 // Есть ли картинка', 
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
                id_last_task_note = NEW.id,
                id_user = NEW.id_user_to
            WHERE 
                id = NEW.id_task;

            RETURN NEW;

        `,

    },
    
    on_after_add_column: {
    
        path: [
            {sql: "UPDATE task_notes SET path = TO_CHAR(ts, 'YYYY/MM/DD/') || uuid || '.' || COALESCE (ext, 'png') WHERE is_illustrated = 1", params: []}
        ],
    
    }

}