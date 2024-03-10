module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_task_notes:

    function () {

        return this.db.invoke ('get_vocs_of_task_notes')

    },

////////////////////////////////////////////////////////////////////////////////

select_task_notes:

    function () {

    	const {db} = this

		const q = db.dxQuery ([['vw_task_notes', {as: 'task_notes'}]])

        q.order = []; q.orderBy ('ts', true)

        return db.getArray (q)

    },

}