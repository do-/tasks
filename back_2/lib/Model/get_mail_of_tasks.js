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

        DECLARE
            _to JSONB;
            _notes JSONB;

        BEGIN

            IF _one THEN
                ${notes ('ORDER BY ts DESC LIMIT 1')};
            ELSE
                ${notes ('ORDER BY ts')};
            END IF;

            SELECT
                JSONB_BUILD_OBJECT (
                    'name',     u.label,
                    'address',  u.mail
                )
            INTO
                _to 
            FROM 
                _ 
                JOIN users u ON _.id_user_to = u.uuid
            LIMIT 
                1;

            SELECT
                JSONB_AGG (mail_content ORDER BY ts)
            INTO
                _notes
            FROM 
                _;

            RETURN JSONB_BUILD_OBJECT (
                'to', _to,
                'notes', _notes
            );

        END;

    `,

}