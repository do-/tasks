////////////////////////////////////////////////////////////////////////////////

$_DO.delete_user = async function (e) {
    
    if (!confirm ('Серьёзно?')) return
    
    await response ({type: 'users', action: 'delete'})

    refreshOpener ()
        
    window.close ()
    
}

////////////////////////////////////////////////////////////////////////////////

$_DO.pass_user = function (e) {

    show_block ('user_password')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_user = async function (e) {

    if (!confirm ('Сохранить изменения?')) return
    
    let $form = $('.drw.form')
    
    let data = values ($form)
    
    $form.block ()    

    await response ({type: 'users', action: 'update'}, {data})

    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.undelete_user = async function (e) {

    if (!confirm ('Восстановить эту запись?')) return

    let $form = $('.drw.form')

    $form.block ()    

    await response ({type: 'users', action: 'undelete'}, {})

    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.choose_tab_user = function (e) {

    localStorage.setItem ('user.active_tab', e.tab.id)

    show_block (e.tab.id)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user = async function (o) {

    let data = await response ({type: 'users'})
    
    data.active_tab = localStorage.getItem ('user.active_tab') || 'user_options'

    $('body').data ('data', data)

    return data

}