module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_sessions: 

    async function () {

    	const {conf: {auth: {sessions: {timeout}}}, db, rq: {data: {login}}, pwd, http: {request: {headers}}} = this

        const user = await db.getObject ('SELECT * FROM users WHERE login = ?', [login])

        if (user.is_deleted) throw '#foo#: Вас пускать не велено'

        if (pwd.cook (headers ['x-request-param-password'], user.salt) !== user.password) return {}

        for (const r of db.model.find ('roles').data) if (user.id_role == r.id) user.role = r.name

        for (const k of ['salt', 'password', 'roles.name']) delete user [k]

        return {user, timeout}

    },

}