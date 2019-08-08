////////////////////////////////////////////////////////////////////////////////

$_DO.fork_task = function (e) {

    show_block ('tasks_new', {body: 'Контекст: ' + location.href})

}

////////////////////////////////////////////////////////////////////////////////

$_GET.task = async function (o) {

    let [data, n, b, r] = await response ({})
    
    data.task_notes = n
    data.back_refs = b
    data.refs = r
    
    data.author   = {id: data.id_user_author,   label: data.user_author_label}
    data.executor = {id: data.id_user_executor, label: data.user_executor_label} 

    data.users = [data.author]
        
    if (data.id_user_author != data.id_user_executor) {
        data.executor.label > data.author.label ? 
            data.users.push    (data.executor) :
            data.users.unshift (data.executor)        
    }
    
    add_vocabularies (data, {users: 1})
    
    $('body').data ('data', data)

    return data

}