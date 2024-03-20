const notes = order => /*sql*/`
    CREATE TEMPORARY TABLE _ ON COMMIT DROP AS SELECT ts, id_user_to, mail_content FROM vw_task_notes WHERE id_task = _uuid ${order}
`

module.exports = {

    label: 'get mail of_tasks',

    parameters: [
        '_uuid UUID',
        '_one BOOL',
    ],

    lang: 'PLPGSQL',

    returns: 'JSONB',

    body: /*sql*/`

        BEGIN

            IF _one THEN
                ${notes ('ORDER BY ts DESC LIMIT 1')};
            ELSE
                ${notes ('ORDER BY ts')};
            END IF;

            RETURN JSONB_BUILD_OBJECT (
                'to',    (SELECT mail_to FROM vw_users WHERE uuid = (SELECT id_user_to FROM _ LIMIT 1)),
                'notes', (SELECT JSONB_AGG (mail_content ORDER BY ts) FROM _)
            );

        END;

    `,

}