$_DRAW.task_refs = async function (data) {

    for (i of data.refs) {
        i.uri = '/tasks/' + i ['vw_tasks.uuid']
        i.class = 'status-' + i ['vw_tasks.id_status']
    }

    return to_fill ('task_refs', data)
    
}