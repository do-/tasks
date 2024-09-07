const {DbQueryOr} = require ('doix-db')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

getVocs:

    async function () {

    	const {db: {model}, request: {type}} = this

		return model.assignData ({
			_fields: model.getFields (type),
		}, [
			'roles',
		])

    },

////////////////////////////////////////////////////////////////////////////////

getPeers:

	async function () {

		return this.db.invoke ('get_peers_of_users', [this.user.uuid])

	},

////////////////////////////////////////////////////////////////////////////////

doSetPeers:

	async function () {

		await this.db.invoke ('do_set_peers_users', [this.user.uuid, JSON.stringify (this.request.data.ids)])

	},

////////////////////////////////////////////////////////////////////////////////

doCreate: 

	async function () {

    	const {db, request} = this, {type, data} = request
		
		await db.insert (type, data, {onlyIfMissing: true})

	},

////////////////////////////////////////////////////////////////////////////////

doUpdate: 

	async function () {

    	const {db, request} = this, {type, data, id} = request

		data.uuid = id
		
		await db.update (type, data)

	},
	
////////////////////////////////////////////////////////////////////////////////

doDelete:
	
	async function () {

        await this.db.do ('UPDATE users SET is_deleted = 1 WHERE uuid = ?', [this.request.id])
	
	},

////////////////////////////////////////////////////////////////////////////////

doUndelete:
	
	async function () {

        await this.db.do ('UPDATE users SET is_deleted = 0 WHERE uuid = ?', [this.request.id])
	
	},

////////////////////////////////////////////////////////////////////////////////

doSetPassword:

    async function () {

    	const {db, request, user, pwd, http: {request: {headers}}} = this, p1 = headers ['x-request-param-p1'], p2 = headers ['x-request-param-p1']

		if (p1 == null) throw Error ('#p1#: Получено пустое значение пароля')
        if (p1 != p2)   throw Error ('#p2#: Повторное значение пароля не сходится')

        const salt     = pwd.sprinkle (32)
        const password = pwd.cook (p1, salt)

		const uuid = (user.role === 'admin' ? request.id : null) || user.uuid

		await db.update ('users', {uuid, salt, password})

    },

////////////////////////////////////////////////////////////////////////////////

getList:

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