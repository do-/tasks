////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_new = async function (e) {

    let f = w2ui ['users_new_form']

    let v = f.values ()
    
    if (!v.id_role) die ('id_role', 'Укажите, пожалуйста, роль')
    if (!v.label)   die ('label', 'Укажите, пожалуйста, ФИО пользователя')
    if (!v.login)   die ('login', 'Укажите, пожалуйста, login пользователя')
    v.uuid = new_uuid ()
    
    f.lock ()

    let data = await response ({action: 'create'}, {data: v})

    w2popup.close ()
        
    let grid = w2ui ['usersGrid']
    
    grid.reload (grid.refresh)

    w2confirm ('Пользователь зарегистрирован. Открыть его карточку?').yes (function () {openTab ('/users/' + data.uuid)})

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_new = async function (o) {

    return $('body').data ('data')
    
}