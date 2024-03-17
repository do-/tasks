const fs   = require ('fs')
const Path = require ('path')
const {randomUUID} = require ('crypto')

const RE = /(src="data:image\/png;base64,.*?")/
const SLASH = '/'.charCodeAt (0)

const extractPics = (src, uuid, root) => {

    if (!src) return src

    const parts = src.split (RE); if (parts.length === 1) return src

    const bymd = Buffer.from (new Date ().toISOString ().slice (0, 10)); bymd [4] = bymd [7] = SLASH

    const ymd = bymd.toString (); root = Path.join (root, 'task_notes', ymd); fs.mkdirSync (root, {recursive: true})

    let i = 0; html = ''; for (const part of parts) {

        if (RE.test (part)) {

            const fn = `${uuid}_${i ++}.png`

            fs.writeFileSync (Path.join (root, fn), src.slice (src.indexOf (','), -1), {encoding: 'base64'})

            html += `src="/_pics/task_notes/${ymd}/${fn}"`

        }
        else html += part

    }

    return html

}

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

        const {uuid, db, rq} = this, {data} = rq, {id_voc_project, label} = data

        const result = {uuid}

        const task = {...result, label, id_voc_project, id_user_author: this.user.uuid}

        await db.insert ('tasks', task)

        rq.id              = task.uuid
        rq.data.id_user_to = task.id_user_author

        await this.module.do_comment_tasks.call (this)

        return result

    },    

////////////////////////////////////////////////////////////////////////////////

do_assign_tasks:

    async function () {

        const {db, rq, user} = this, {id, data} = rq, {id_user_to} = data; if (!id_user_to) throw Error ('#id_user_to#:Не указан адресат')

        {

            data.id_user_to = user.uuid

            await this.module.do_comment_tasks.call (this)

        }

        await db.do ('UPDATE tasks SET id_user_executor = ? WHERE uuid = ?', [id_user_to, id])

    },

////////////////////////////////////////////////////////////////////////////////

do_comment_tasks:

    async function () {

        const {conf, db, rq: {id, data}, user} = this

        const task_note = {
            uuid: randomUUID (),
            ...data,
            id_task: id,
            id_user_from: user.uuid,
        }

        if (task_note.id_user_to <= 0) task_note.id_user_to = null

        data.body = extractPics (data.body, task_note.uuid, conf.pics)

        await db.insert ('task_notes', task_note)

    },

////////////////////////////////////////////////////////////////////////////////

do_notify_tasks:

    async function () {

        const {db, rq: {id, one}} = this

        let sql = /*sql*/`
            SELECT 
                t.*                
                , u.label AS name
                , u.mail  AS address
            FROM
                task_notes t
                JOIN users u ON t.id_user_to = u.uuid
            WHERE
                t.id_task = ?
            ORDER BY
                t.ts
        `

        if (one) sql += ' DESC LIMIT 1'

        const notes = await db.getArray (sql, [id])

        if (notes.length === 0) return

        const [first] = notes, {name, address} = first

        const msg = {        
            to: {name, address},
            html: `<html><body>`,
        }

        for (let note of notes) {

            if (msg.subject) {
                msg.html += `<h1>${note.label}</h2>${note.body}`
            }
            else {
                msg.subject = note.label
                msg.html += note.body
            }
            
        }

        msg.html += `<br><br><small><a href="/tasks/${id}">${id}</a></small></body>`

        return msg

    },

}