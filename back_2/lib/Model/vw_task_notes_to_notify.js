module.exports = {

    label : 'Реплики',

    columns : {

        uuid               : 'uuid',
        ts                 : 'timestamp // Дата/время',
        mail_content       : "jsonb // Содержимое для извещения",

    },

    pk: 'uuid',

    queue: {

        request: {type: 'task_note_notifications', action: 'process'},

        order: 'ts DESC',

    },

    sql: /*sql*/ `
	
		SELECT
            t.uuid,
            t.ts,
            JSONB_BUILD_OBJECT (
                'to',      u.mail_to,
                'subject', t.label,
                'html',    t.body,
                'id',      t.id_task
            ) mail_content
		FROM
			vw_task_notes t
            JOIN vw_users u ON t.id_user_to = u.uuid
        WHERE
            t.is_to_notify
		
	`,

}