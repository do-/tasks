module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_process_task_notifications:

    async function () {

        const {db, rq: {id, one}} = this

        const {to, notes} = await db.invoke ('get_mail_of_tasks', [id, one])

        let subject, html = ''; for (const {label, body} of notes) {

            if (!subject) subject = label; else html += `<h1>${label}</h1>`

            html += body

        }

        return {to, subject, html, id}

    },

}