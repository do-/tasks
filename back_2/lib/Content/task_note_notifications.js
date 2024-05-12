module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_process_task_note_notifications:

    async function () {

        const {db, rq: {uuid, mail_content: {to, subject, html, id}}} = this

        await db.do ('UPDATE task_notes SET is_to_notify = FALSE WHERE uuid = ?', [uuid])

        return {to, subject, html, id}

    },

}