////////////////////////////////////////////////////////////////////////////////

$_DO.toggle_user_options = async function (e, a) {

    let r = a.grid.getDataItem (a.row)

    var data = {id_voc_user_option: r.id}

    data.is_on = 1 - (r ['user_options.is_on'] || 0)

    if (!confirm ((data.is_on ? 'Установить' : 'Снять') + ' опцию "' + r.label + '"?')) return
    
    $("#user_options").block ()

    await response ({type: 'users', action: 'set_option'}, {data})
    
    $("#user_options").data ('grid').reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_options = async function (o) {

    return $('body').data ('data')

}
