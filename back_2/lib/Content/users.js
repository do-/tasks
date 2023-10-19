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

    	const {db, rq} = this

		rq.search = rq.search.filter (i => i.value !== null || i.field !== 'is_deleted')
	
        if (rq.searchLogic === 'OR') {

            const {value} = rq.search [0]

            rq.search = ['label', 'login', 'mail'].map (field => ({field, operator: 'contains', value}))

        }
        
		const q = db.w2uiQuery (
			[
				['users'],
				['roles', {as: 'role'}]
			], 
			{order: ['label']}
		)

		q.tables [0].filters.push ({
			sql: '(users.is_deleted=0 AND users.uuid <> ?)', 
			params: ['00000000-0000-0000-0000-000000000000']
		})

		return db.getArray (q)

    },

}