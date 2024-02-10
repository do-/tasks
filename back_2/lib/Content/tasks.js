module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tasks:

    async function () {

		const {db} = this, {model}= db, SELECT_FROM = "SELECT JSONB_AGG (JSONB_BUILD_OBJECT ('id', uuid, 'label', label) ORDER BY label) FROM"

        const data = await db.getScalar (/*sql*/`
            SELECT JSONB_BUILD_OBJECT (
                'users',        (${SELECT_FROM} users WHERE uuid IN (SELECT DISTINCT id_user FROM task_users)),
                'voc_projects', (${SELECT_FROM} voc_projects)
            )
        `)

        for (const k of ['voc_task_status']) data [k] = model.find (k).data

        return data

    },

////////////////////////////////////////////////////////////////////////////////

select_tasks: 

    function () {

    	const {db, rq: {loadOptions}} = this

        loadOptions.sort = [{selector: 'ts'}]

        const {filter} = loadOptions; if (filter) {

            const head = filter [0]; if (head [0] === 'note') {

                head [0] = 'uuid'

                head [1] = 'IN'

                head [2] = {

                    sql: `SELECT id_task FROM task_notes WHERE txt ILIKE ?`,

                    params: ['%' + head [2] + '%']

                }

            }

        }

		const q = db.dxQuery (
			[
				['vw_tasks', {as: 'tasks'}],
			]
        )

		return db.getArray (q)

    },
       
}