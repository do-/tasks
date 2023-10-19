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