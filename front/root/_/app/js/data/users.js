////////////////////////////////////////////////////////////////////////////////

$_DO.create_users = function (e) {

    show_block ('user_new')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.users = async function (o) {

    let data = await response ({type: 'roles'})
    
    add_vocabularies (data, {roles: 1})
    
    $('body').data ('data', data)
            
    return data

}