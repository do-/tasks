const {DbQueryOr} = require ('doix-db')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_users: 

    async function () {

    	const {db: {model}, rq: {type}} = this

		const data = {		
			_fields: model.getFields (type),				
		}
		
		for (const k of ['roles']) data [k] = model.find (k).data

        return data

    },

////////////////////////////////////////////////////////////////////////////////

get_peers_of_users:

	async function () {

    	const {db, user} = this

		const users = await db.getArray (/*sql*/`
			SELECT 
				t.uuid, 
				t.label, 
				t.uuid id, 
				m.id_user "user_user.id_user", 
				m.id_user_ref "user_user.id_user_ref" 
			FROM 
				users t 
				LEFT JOIN user_users m ON m.id_user_ref = t.uuid AND m.id_user = $1
			WHERE 
				t.login IS NOT NULL
				AND t.uuid <> $1 
				AND t.is_deleted = 0
			ORDER BY 
				2
		`, [user.uuid])

		return {users}

	},

////////////////////////////////////////////////////////////////////////////////

do_set_peers_users:

	async function () {

		const {db, rq: {data: {ids}}, user: {uuid}} = this

		await db.do (/*sql*/ `CREATE TEMP TABLE _ (uuid uuid not null) ON COMMIT DROP`)

		await db.insertArray ('_', ids.map (uuid => ({uuid})), {columns: {uuid: 'text'}})

		await db.do (/*sql*/ `DELETE FROM user_users WHERE id_user = ? AND id_user_ref NOT IN (SELECT uuid FROM _)`, [uuid])

		await db.do (/*sql*/ `
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
		`, [uuid])

	},

////////////////////////////////////////////////////////////////////////////////

do_create_users: 

	async function () {

    	const {db, rq} = this, {type, data, id} = rq
		
		await db.insert (type, data, {onlyIfMissing: true})

	},

////////////////////////////////////////////////////////////////////////////////

do_update_users: 

	async function () {

    	const {db, rq} = this, {type, data, id} = rq

		data.uuid = id
		
		await db.update (type, data)

	},
	
////////////////////////////////////////////////////////////////////////////////

do_delete_users:
	
	async function () {

		const {db, rq} = this, {id} = rq

		await db.do ('DELETE FROM user_users WHERE id_user_ref = ?', [id])

        await db.do ('UPDATE users SET is_deleted = 1 WHERE uuid = ?', [id])
	
	},

////////////////////////////////////////////////////////////////////////////////

do_undelete_users: 
	
	async function () {
	
		const {db, rq} = this

        await db.do ('UPDATE users SET is_deleted = 0 WHERE uuid = ?', [rq.id])
	
	},


////////////////////////////////////////////////////////////////////////////////

do_set_password_users:

    async function () {

    	const {db, rq, user, pwd, http: {request: {headers}}} = this, p1 = headers ['x-request-param-p1'], p2 = headers ['x-request-param-p1']

		if (p1 == null) throw '#p1#: Получено пустое значение пароля'
        if (p1 != p2)   throw '#p2#: Повторное значение пароля не сходится'

        const salt     = pwd.sprinkle (32)
        const password = pwd.cook (p1, salt)

		const uuid = (user.role === 'admin' ? rq.id : null) || user.uuid

		await db.update ('users', {uuid, salt, password})

    },

////////////////////////////////////////////////////////////////////////////////

select_users: 

    async function () {

    	const {db} = this

		const q = db.w2uiQuery (
			[
				['users', {filters: [['uuid', '<>', '00000000-0000-0000-0000-000000000000']]}],
				['roles', {as: 'role'}]
			], 
			{order: ['label']}
		)

		{

			const {root} = q; for (const [k, op, v] of root.unknownColumnComparisons) if (k === 'q') {

				const value = v.slice (1); root.addFilter (DbQueryOr.from (
					[
						'label', 
						'login', 
						'mail'
					].map (field => root.createColumnComparison (field, op, value))
				))

			}

		}

		return db.getArray (q)

    },

}