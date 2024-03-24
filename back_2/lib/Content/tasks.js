const {randomUUID} = require ('crypto')

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

do_create_tasks:

    async function () {

        const {db, rq} = this, {id, data} = rq, {id_voc_project, label} = data

        const result = {uuid: id}

        const task = {...result, label, id_voc_project, id_user_author: this.user.uuid}

        if (!await db.insert ('tasks', task, {onlyIfMissing: true})) return result

        rq.data.id_user_to = task.id_user_author
        rq.data.uuid       = task.uuid

        await this.module.do_comment_tasks.call (this)

        return result

    },

////////////////////////////////////////////////////////////////////////////////

do_assign_tasks:

    async function () {

        const {db, rq, user} = this, {id, data} = rq, {id_user_to} = data; if (!id_user_to) throw Error ('#id_user_to#:Не указан адресат')

        data.id_user_to = user.uuid

        if (!await this.module.do_comment_tasks.call (this)) return

        await db.do ('UPDATE tasks SET id_user_executor = ? WHERE uuid = ?', [id_user_to, id])

    },

////////////////////////////////////////////////////////////////////////////////

do_comment_tasks:

    async function () {

        const {db, rq: {id, data}, user, pix} = this, {uuid} = data

        data.body = pix.process (data.body || '', uuid)

        const task_note = {
            ...data,
            id_task: id,
            id_user_from: user.uuid,
        }

        if (task_note.id_user_to <= 0) task_note.id_user_to = null

        return db.insert ('task_notes', task_note, {onlyIfMissing: true})

    },

////////////////////////////////////////////////////////////////////////////////

do_notify_tasks:

    async function () {

        const {conf, db, rq: {id, one}} = this

        const {to, notes} = await db.invoke ('get_mail_of_tasks', [id, one])

        let subject, html = `
        <html>
            <body>
            <head>
                <base href="${conf.base}">
            </head>
        `
            for (const {label, body} of notes) {

                if (!subject) subject = label; else html += `<h1>${label}</h1>`

                html += body

            }

        html += `
                <br><br>
                <small><a href="/tasks/${id}">${id}</a></small>
            </body>
        </html>`

        return {to, subject, html}

    },

}