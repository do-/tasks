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
        id_status: [101],
        id_user_author: [$_USER.id]
    })

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks = async function (o) {

    let data = await response ({part: 'vocs'})
    
    add_vocabularies (data, {users: 1, voc_task_status: 1})
    
    data.others = data.users.items.filter ((r) => r.id != $_USER.id)
    
    data.note = $_SESSION.delete ('note')

    $('body').data ('data', data)

    let e = Object.entries (o); if (!e.length && !data.note) e = [['id_user', [$_USER.uuid]]]

	let search = e.map (fv => {[field, value] = fv; darn ({field, value}); return {field, value, operator: 'in'}})

    data.src = [$_REQUEST.type, {search}]

    return data

}