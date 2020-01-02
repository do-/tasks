////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_new = async function (e) {

    let $this = get_popup ()

    let data = $this.valid_data ()    

    data.uuid = new_uuid ()

    $this.block ()

    data = await response ({action: 'create'}, {data})

    close_popup ()

    if (confirm ('Пользователь зарегистрирован. Открыть его карточку?')) open_tab ('/users/' + data.uuid)

    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_new = async function (o) {

    let data = clone ($('body').data ('data'))      

    data.id_role = 2

    return data

}