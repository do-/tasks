module.exports = {

    label: 'do_set_peers_users',

    parameters: [
        '_uuid UUID',
        '_ids JSONB',
    ],

    lang: 'PLPGSQL',

    body: /*sql*/`

        BEGIN

            CREATE TEMP TABLE _ (uuid UUID PRIMARY KEY) ON COMMIT DROP;

            INSERT INTO _ SELECT JSONB_ARRAY_ELEMENTS_TEXT (_ids)::UUID;

            DELETE FROM user_users WHERE id_user = _uuid AND id_user_ref NOT IN (SELECT uuid FROM _);

            INSERT INTO user_users (
                id_user
                , id_user_ref
            )
            SELECT
                ? id_user
                , uuid id_user_ref
            FROM
                _
            ON CONFLICT
                DO NOTHING
            ;

        END;

    `,

}