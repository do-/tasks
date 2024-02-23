const TEST_USER = {
    uuid  : '00000000-0000-0000-0000-000000000000',
    label : 'admin',
    role  : 'admin',
}

module.exports = {

allowAnonymous: true,

////////////////////////////////////////////////////////////////////////////////

do_delete_sessions: 

    async function () {

        this.user = null

    },

////////////////////////////////////////////////////////////////////////////////

do_create_sessions: 

    async function () {

    	const {conf: {auth: {allow_test_admin, sessions: {timeout}}}, db, rq: {data: {login}}, pwd, http: {request: {headers}}} = this

        const user = await db.getObject ('SELECT * FROM users WHERE login = ?', [login], {notFound: TEST_USER})

        const pass = headers ['x-request-param-password']

        if (user === TEST_USER) {

            if (!allow_test_admin || login !== 'test' || pass !== 'test') return {}

        }
        else {

            if (user.is_deleted) throw '#foo#: Вас пускать не велено'

            if (pwd.cook (pass, user.salt) !== user.password) return {}
    
            for (const r of db.model.find ('roles').data) if (user.id_role == r.id) user.role = r.name
    
            for (const k of ['salt', 'password', 'roles.name']) delete user [k]
    
        }

        {

            const {uuid, role} = user

            this.user = {uuid, role}

        }

        user.peers = await db.getArray (/*sql*/`
            SELECT
                u.uuid id
                , u.label
            FROM
                user_users t
                JOIN users u ON t.id_user_ref = u.uuid AND u.login IS NOT NULL
            WHERE
                id_user = ?
            ORDER BY
                2
        `, [user.id = user.uuid])

        return {user, timeout}

    },

}