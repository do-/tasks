////////////////////////////////////////////////////////////////////////////////

$_DO.create_users = function (e) {

    show_block ('user_new')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.users = async function (o) {

    let data = await response ({type: 'users', part: 'vocs'})
    
    add_vocabularies (data, {roles: 1})
    
    $('body').data ('data', data)
            
    data.src = $_REQUEST.type

    return data

}