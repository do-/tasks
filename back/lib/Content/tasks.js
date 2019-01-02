const _ = exports

// #############################################################################

_.select = async function () {

    let params = ['1']

    return {
        portion:100,
        tasks: await this.db.select_all ('SELECT tasks.label AS "label" , tasks.id_user AS "id_user" , tasks.ts AS "ts" , tasks.id_last_task_note AS "id_last_task_note" , tasks.id AS "id" , tasks.fake AS "fake" , tasks.uuid AS "uuid" , task_notes.uuid AS "task_note.uuid" , task_notes.id_user_from AS "task_note.id_user_from" , task_notes.ext AS "task_note.ext" , task_notes.id_user_to AS "task_note.id_user_to" , task_notes.id_task AS "task_note.id_task" , task_notes.is_illustrated AS "task_note.is_illustrated" , task_notes.label AS "task_note.label" , task_notes.body AS "task_note.body" , task_notes.fake AS "task_note.fake" , task_notes.id AS "task_note.id" , task_notes.ts AS "task_note.ts" FROM tasks LEFT JOIN task_notes ON (id_last_task_note = task_notes.id ) WHERE 1=1 AND (tasks.id_user IN ($1)) AND tasks.fake = 0 ORDER BY tasks.id ASC LIMIT 100 OFFSET 0', params),
        cnt: await this.db.select_scalar ('SELECT COUNT(*) FROM tasks LEFT JOIN task_notes ON (id_last_task_note = task_notes.id ) WHERE 1=1 AND (tasks.id_user IN ($1)) AND tasks.fake = 0', params),
    }

}

// #############################################################################

_.get_vocs = async function () {

    return {
//        users: await this.db.select_all ("SELECT id, label, fake FROM users WHERE 1=1 AND fake = 0 AND id > 0 ORDER BY 2"),
        users: await this.db.select_vocabulary ('users', {filter: 'id > 0'}),
    }

}