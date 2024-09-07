module.exports = {

////////////////////////////////////////////////////////////////////////////////

doProcess:

    async function () {

        const {db, request: {uuid, mail_content: {to, subject, notes, id}}} = this

        let html = ''; for (const {label, body} of notes) {

            if (html) html += `<h1>${label}</h1>`

            if (body) html += body

        }

        await db.do ('UPDATE tasks SET is_to_notify = FALSE WHERE uuid = ?', [uuid])

        return {to, subject, html, id}

    },

}