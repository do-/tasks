////////////////////////////////////////////////////////////////////////////////

$_GET.task_refs = async function (o) {
        
    for (i of o.refs) i.uri = '/tasks/' + i ['tasks.uuid']
    
    return o

}