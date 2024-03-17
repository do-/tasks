module.exports = {

    label: 'notify on task',

    parameters: [
        'uuid UUID',
        'from_start BOOL = FALSE',
    ],

    lang: 'SQL',

    returns: 'VOID',

	body: /*sql*/`
        SELECT pg_notify ('mail', JSON_BUILD_ARRAY (uuid, to_json (NOT from_start))::TEXT);
    `,

}