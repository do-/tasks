////////////////////////////////////////////////////////////////////////////////

$_GET.task = async function (o) {

    let data = await response ({})
    
    data.author   = {id: data.id_user_author,   label: data ['user_a.label']}
    data.executor = {id: data.id_user_executor, label: data ['user_e.label']}

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