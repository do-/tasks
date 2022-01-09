///////////////////////////////////////////////////////////////////////////////

$_DO.update_user_peers = async function (data) {

    await response ({type: 'users', action: 'set_peers'}, {data})

    $_USER.peers = (await response ({type: 'users', id: null, part: 'peers'}))
        .users.filter (i => i ['user_user.id_user'])

    $_SESSION.set ('user', $_USER)
    $_LOCAL.set ('user', $_USER)   

    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_peers = async function (o) {

    let data = await response ({type: 'users', id: null, part: 'peers'})
    
    data.ids = data.users.filter (i => i ['user_user.id_user']).map (i => i.uuid)

    return data

}