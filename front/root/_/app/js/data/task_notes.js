////////////////////////////////////////////////////////////////////////////////

$_GET.task_notes = async function (o) {

    let data = await response ({part: 'vocs'})
    
    add_vocabularies (data, {users: 1, voc_projects: 1})
    
    data.src = $_REQUEST.type

    return data

}