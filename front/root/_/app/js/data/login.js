////////////////////////////////////////////////////////////////////////////////

$_DO.execute_login = async function (e) {
        
    let form = w2ui ['form']
    
    form.lock ()

    let data = await response ({type: 'sessions', action: 'create'}, {data: values ($('main'))})

    form.unlock ()

    if (!data || !data.user) return alert ('Ошибка аутентификации')

    $_SESSION.start (data.user, data.timeout)
                
    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.login = async function (o) {}