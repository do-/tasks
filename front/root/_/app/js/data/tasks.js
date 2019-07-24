////////////////////////////////////////////////////////////////////////////////

$_DO.create_tasks = function (e) {

    show_block ('tasks_new')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.show_required_tasks = function () {

    show_block ('tasks', {
        id_user: $_USER.id,
    })
    
}    

////////////////////////////////////////////////////////////////////////////////

$_DO.show_created_tasks = function () {

    show_block ('tasks', {
        id_user: -1,
        id_author: $_USER.id
    })

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks = async function (o) {

    let data = await response ({part: 'vocs'})
    
    add_vocabularies (data, {users: 1})
    
    data.others = data.users.items.filter ((r) => r.id != $_USER.id)
    
    $('body').data ('data', data)
    
    let n = 0
    
    for (k in o) {
        data [k] = o [k]
        n ++
    }
    
    if (!n) data.id_user = $_USER.uuid

    return data

}