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

        return db.getScalar (/*sql*/`
            WITH 
            t1 AS (SELECT ROW_TO_JSON (t) v FROM vw_tasks t WHERE uuid = $1),
            t2 AS (SELECT JSONB_AGG (ROW_TO_JSON (t) ORDER BY t.ts) AS v FROM task_notes t WHERE t.id_task = $1),
            t3 AS (SELECT JSONB_AGG (ROW_TO_JSON (t) ORDER BY t.ts) AS v FROM task_tasks r JOIN vw_tasks t ON r.id_task = t.uuid WHERE r.id_task_to = $1),
            t4 AS (SELECT JSONB_AGG (ROW_TO_JSON (t) ORDER BY t.ts) AS v FROM task_tasks r JOIN vw_tasks t ON r.id_task_to = t.uuid WHERE r.id_task = $1),
            t5 AS (SELECT JSONB_AGG (JSONB_BUILD_OBJECT ('id', uuid, 'label', label) order by label) AS v FROM voc_projects)
            SELECT
                JSONB_BUILD_ARRAY (
                    t1.v
                    , t2.v
                    , COALESCE (t3.v, '[]')
                    , COALESCE (t4.v, '[]')
                    , t5.v
                )
            FROM
                t1, t2, t3, t4, t5
        `, [id])

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