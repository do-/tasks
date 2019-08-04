////////////////////////////////////////////////////////////////////////////////

$_DO.create_tasks = function (e) {

    show_block ('tasks_new')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.show_required_tasks = function () {

    show_block ('tasks', {
        id_user: [$_USER.id],
    })
    
}    

////////////////////////////////////////////////////////////////////////////////

$_DO.show_created_tasks = function () {

    show_block ('tasks', {
        is_open: 1,
        id_user_author: [$_USER.id]
    })

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks = async function (o) {

    let data = await response ({part: 'vocs'})
    
    data.voc_status = [
        {id: 1, label: 'В работе'},
        {id: 0, label: 'Закрыто'},
    ]
    
    add_vocabularies (data, {users: 1, voc_status: 1})
    
    data.others = data.users.items.filter ((r) => r.id != $_USER.id)
    
    $('body').data ('data', data)
    
    let n = 0
    
    for (k in o) {
        data [k] = o [k]
        n ++
    }
    
    if (!n) data.id_user = [$_USER.uuid]

    return data

}