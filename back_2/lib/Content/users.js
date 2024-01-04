const {DbQueryTableColumnComparison, DbQueryOr} = require ('doix-db')

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

select_users: 

    async function () {

    	const {db, rq} = this, {search} = rq

		rq.search = [{field: 'uuid', operator: 'is not', value: '00000000-0000-0000-0000-000000000000'}]

		const q = db.w2uiQuery (
			[
				['users'],
				['roles', {as: 'role'}]
			], 
			{order: ['label']}
		)

		const [root] = q.tables

		for (const {field, value} of search) switch (field) {

			case 'is_deleted':
				if (value !== null) new DbQueryTableColumnComparison (root, field, '=', value)
				break

			case 'q':
				const params = [value + '%']
				root.filters.push (new DbQueryOr (
					['label', 'login', 'mail'].map (field => ({
						sql: `${root.sql}.${field} ILIKE ?`,
						params,
					})),	
				))
				break

		}

		return db.getArray (q)

    },

}