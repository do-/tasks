////////////////////////////////////////////////////////////////////////////////

$_DO.execute_login = async function (e) {
        
    $('body').block ()
            
    let data = await response ({type: 'sessions', action: 'create'}, {data: values ($('main'))})

    if (!data || !data.user) return $('body').unblock () && alert ('Ошибка аутентификации')

    $_SESSION.start (data.user, data.timeout)
                
    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.login = async function (o) {}