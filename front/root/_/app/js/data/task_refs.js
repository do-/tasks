////////////////////////////////////////////////////////////////////////////////

$_GET.task_refs = async function (o) {
        
    for (i of o.refs) i.uri = '/tasks/' + i ['vw_tasks.uuid']
    
    return o

}