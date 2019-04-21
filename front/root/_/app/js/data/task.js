$_GET.task = async function (o) {

    let data = await response ({})
    
    add_vocabularies (data, {users: 1})
            
    $('body').data ('data', data)

    return data

}