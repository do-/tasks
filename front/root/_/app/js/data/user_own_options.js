////////////////////////////////////////////////////////////////////////////////

$_DO.toggle_user_own_options = async function (e) {

    let g = w2ui ['user_own_options_grid']
    
    let data = {}

    let r = g.get (data.id_voc_user_option = e.recid)

    data.is_on = 1 - (r ['user_options.is_on'] || 0)

    if (!confirm ((data.is_on ? 'Установить' : 'Снять') + ' опцию "' + r.label + '"?')) return

    await response ({type: 'users', action: 'set_own_option'}, {data: data})
    
    window.__LOGOUT__ = 1

    $_USER.opt [r.name] = data.is_on

    localStorage.removeItem ('user')
    localStorage.setItem ('user', 1)
    $_SESSION.set ('user', $_USER)

    delete window.__LOGOUT__
    
    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_own_options = async function (o) {return {}}