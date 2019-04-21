////////////////////////////////////////////////////////////////////////////////

$_DO.delete_user = function (e) {
    
    if (!confirm ('Серьёзно?')) return
    
    query ({action: 'delete'}, {}, function (data) {

        refreshOpener ()
        
        window.close ()

    })
    
}

////////////////////////////////////////////////////////////////////////////////

$_DO.pass_user = function (e) {

    show_block ('user_password')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_user = function (e) {

    if (!confirm ('Сохранить изменения?')) return
    
    var d = w2ui ['form'].values ()
     
    w2ui ['form'].lock ();

    query ({action: 'update'}, {data: d}, function (data) {
              
       location.reload ()
   
    })
    
}

////////////////////////////////////////////////////////////////////////////////

$_DO.choose_tab_user = function (e) {

    localStorage.setItem ('user.active_tab', e.tab.id)

    show_block (e.tab.id)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user = async function (o) {

    let data = await response ({})
    
    data.active_tab = localStorage.getItem ('user.active_tab') || 'user_options'

    $('body').data ('data', data)

    return data

}