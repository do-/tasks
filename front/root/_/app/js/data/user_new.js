////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_new = async function (e) {

    let $this = $(e.target).closest ('.ui-dialog').find ('.ui-dialog-content')

    let data = values ($this)    

    if (!data.label)   die ('label', 'Укажите, пожалуйста, ФИО пользователя')
    if (!data.id_role) die ('id_role', 'Укажите, пожалуйста, роль')
    if (!data.login)   die ('login', 'Укажите, пожалуйста, login пользователя')

    data.uuid = new_uuid ()

    $this.dialog ("widget").block ()

    data = await response ({action: 'create'}, {data})

    $this.dialog ("close")

    if (confirm ('Пользователь зарегистрирован. Открыть его карточку?')) open_tab ('/users/' + data.uuid)

    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_new = async function (o) {

    return $('body').data ('data')
    
}