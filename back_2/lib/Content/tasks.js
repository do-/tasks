module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tasks:

    async function () {

		const {db} = this, {model} = db

        return model.assignData (
            await db.invoke ('get_vocs_of_task_notes'),
            [
                'voc_task_status',
            ]
        )

    },

////////////////////////////////////////////////////////////////////////////////

get_item_of_tasks:

    async function () {

    	const {db, rq: {id}} = this

        return db.invoke ('get_item_of_tasks', [id])

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

////////////////////////////////////////////////////////////////////////////////

do_comment_tasks:

    async function () {

        const child = this.clone ({
            type: 'task_notes',
            action: 'create',
            id: undefined
        })

        child.user = this.user

        child.rq.data.id_task = this.rq.id

        await child.toComplete ()

    },

}