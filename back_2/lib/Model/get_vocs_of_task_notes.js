const SELECT_FROM = "SELECT JSONB_AGG (JSONB_BUILD_OBJECT ('id', uuid, 'label', label) ORDER BY label) FROM"

module.exports = {

    label: 'get_vocs_of_task_notes',

    lang: 'SQL',

    returns: 'JSONB',

	body: /*sql*/`

        SELECT JSONB_BUILD_OBJECT (
            'users',        (${SELECT_FROM} users WHERE label IS NOT NULL),
            'voc_projects', get_voc_projects__actual ()
        )

    `,

}