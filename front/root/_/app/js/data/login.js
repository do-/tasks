$_DO.execute_login = function (e) {
    
    var param = values ($('main'))
    
    w2ui ['form'].lock ()

    query ({type: 'sessions', action: 'create'}, {data: param}, function (data) {

        w2ui ['form'].unlock ()

        if (!data || !data.user) return alert ('Ошибка аутентификации')

        $_SESSION.start (data.user, data.timeout)
                    
        location.reload ()

    })

}

$_GET.login = async function (o) {}