////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_new = function (e) {

    var f = w2ui ['users_new_form']

    var v = f.values ()
    
    if (!v.id_role) die ('id_role', 'Укажите, пожалуйста, роль')
    if (!v.label)   die ('label', 'Укажите, пожалуйста, ФИО пользователя')
    if (!v.login)   die ('login', 'Укажите, пожалуйста, login пользователя')
    
    f.lock ()

    query ({action: 'create'}, {data: v}, function (data) {
        
        w2popup.close ()
        
        var grid = w2ui ['usersGrid']
        
        grid.reload (grid.refresh)

        w2confirm ('Пользователь зарегистрирован. Открыть его карточку?').yes (function () {openTab ('/users/' + data.uuid)})
    
    })

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_new = async function (o) {

    return $('body').data ('data')
    
}