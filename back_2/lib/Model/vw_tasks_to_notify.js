module.exports = {

    label : 'Реплики',

    columns : {

        uuid               : 'uuid',
        ts                 : 'timestamp // Дата/время',
        mail_content       : "jsonb // Содержимое для извещения",

    },

    pk: 'uuid',

    queue: {

        rq: {type: 'task_notifications', action: 'process'},

        order: 'ts DESC',

    },

	sql: /*sql*/ `

		SELECT
            t.uuid,
            t.ts,           
            JSONB_BUILD_OBJECT (
                'to',      u.mail_to,
                'subject', t.label,
                'notes', (SELECT JSONB_AGG (
                    JSONB_BUILD_OBJECT ('label', label, 'body', body)
                    ORDER BY ts
                ) FROM task_notes WHERE id_task = t.uuid),
                'id',      t.uuid
            ) mail_content
		FROM
			tasks t
            JOIN vw_users u ON t.id_user_executor = u.uuid
        WHERE
            t.is_to_notify

	`,

}