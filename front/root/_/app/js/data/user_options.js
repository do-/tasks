////////////////////////////////////////////////////////////////////////////////

$_DO.toggle_user_options = async function (e) {

    var g = w2ui ['options_grid']
    
    var data = {}

    var r = g.get (data.id_voc_user_option = e.recid)

    data.is_on = 1 - (r ['user_options.is_on'] || 0)

    if (!confirm ((data.is_on ? 'Установить' : 'Снять') + ' опцию "' + r.label + '"?')) return

    await response ({action: 'set_option'}, {data: data})

    g.request ('get')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_options = async function (o) {

    return $('body').data ('data')

}
