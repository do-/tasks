module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_process_task_note_notifications:

    async function () {

        const {db} = this

        const {uuid, mail_content: {to, subject, html, id}} = await db.getObject ('SELECT * FROM vw_task_notes_to_notify ORDER BY ts DESC LIMIT 1')

        await db.do ('UPDATE task_notes SET is_to_notify = FALSE WHERE uuid = ?', [uuid])

        return {to, subject, html, id}

    },

}