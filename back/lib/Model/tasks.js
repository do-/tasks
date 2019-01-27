module.exports = {

    label: 'Дела',

    columns: {

        id_user            : "(users) // У кого на рассмотрении",

        label              : "text // Тема", 

        ts                 : "timestamp=now() // Когда оформлено",

        id_last_task_note  : "(task_notes) // Последняя реплика",

    },

    keys : {
        uuid    : 'uuid',
        id_user : 'id_user',
    },

}