module.exports = {

// #############################################################################

select: async function () {
    
    let [all, cnt] = await this.db.select_all_cnt ('SELECT tasks.label AS "label" , tasks.id_user AS "id_user" , tasks.ts AS "ts" , tasks.id_last_task_note AS "id_last_task_note" , tasks.id AS "id" , tasks.fake AS "fake" , tasks.uuid AS "uuid" , task_notes.uuid AS "task_note.uuid" , task_notes.id_user_from AS "task_note.id_user_from" , task_notes.ext AS "task_note.ext" , task_notes.id_user_to AS "task_note.id_user_to" , task_notes.id_task AS "task_note.id_task" , task_notes.is_illustrated AS "task_note.is_illustrated" , task_notes.label AS "task_note.label" , task_notes.body AS "task_note.body" , task_notes.fake AS "task_note.fake" , task_notes.id AS "task_note.id" , task_notes.ts AS "task_note.ts" FROM tasks LEFT JOIN task_notes ON (id_last_task_note = task_notes.id ) WHERE 1=1 AND (tasks.id_user IN (?)) AND tasks.fake = 0 ORDER BY tasks.id ASC LIMIT 100 OFFSET 0', [1])
    
    return {
        portion:100,
        tasks: all,
        cnt: cnt,
    }

},

// #############################################################################

get_vocs: async function () {

    return await this.db.add_vocabularies ({}, {
        users: {filter: 'id > 0'}
    })

}

// #############################################################################

}