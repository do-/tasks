const SELECT_FROM = "SELECT JSONB_AGG (JSONB_BUILD_OBJECT ('id', uuid, 'label', label) ORDER BY label) FROM"

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tasks:

    async function () {

		const {db} = this, {model}= db

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

get_item_of_tasks: 

    async function () {

    	const {db, rq: {id}} = this

        return db.getScalar (`SELECT get_item_of_tasks (?)`, [id])

    },

////////////////////////////////////////////////////////////////////////////////

select_tasks:

    function () {

    	const {db} = this

        const q = db.dxQuery ([['vw_tasks', {as: 'tasks'}]], {order: ['ts']}), {root} = q

        for (const [k, _, v] of root.unknownColumnComparisons) if (k === 'note') root.addColumnComparison ('uuid', 'IN',

            db.model.createQuery ([
                ['vw_task_notes', {
                    columns: ['id_task'],
                    filters: [['txt', 'ILIKE', '%' + v + '%']]
                }]
            ])
        )

        q.order = []; q.orderBy ('ts')

		return db.getArray (q)

    },
       
}