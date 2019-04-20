$_GET.task_notes = async function (o) {

    let data = await response ({part: 'vocs'})
    
    add_vocabularies (data, {users: 1})
            
    return data

}