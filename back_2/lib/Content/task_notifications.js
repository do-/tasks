module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_process_task_notifications:

    async function () {

        const {db} = this

        const {uuid, mail_content: {to, subject, notes, id}} = await db.getObject ('SELECT * FROM vw_tasks_to_notify ORDER BY ts DESC LIMIT 1')

        let html = ''; for (const {label, body} of notes) {

            if (html) html += `<h1>${label}</h1>`

            if (body) html += body

        }

        await db.do ('UPDATE tasks SET is_to_notify = FALSE WHERE uuid = ?', [uuid])

        return {to, subject, html, id}

    },

}