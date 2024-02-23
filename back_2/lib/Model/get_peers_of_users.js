module.exports = {

    label: 'get_peers_of_users',

    parameters: [
        '_uuid UUID',
    ],

    lang: 'SQL',

    returns: 'JSONB',

	body: /*sql*/`
        SELECT
            JSONB_BUILD_OBJECT ('users',
                JSONB_AGG (
                    JSONB_BUILD_OBJECT (
                        'id', t.uuid, 
                        'uuid', t.uuid, 
                        'label', t.label,
                        'user_user.id_user', m.id_user,
                        'user_user.id_user_ref', m.id_user_ref
                    ) 
                    ORDER BY t.label
                )
            )
		FROM
			users t
			LEFT JOIN user_users m ON m.id_user_ref = t.uuid AND m.id_user = _uuid
		WHERE
			t.login IS NOT NULL
			AND t.uuid <> _uuid
			AND t.is_deleted = 0
    `,

}