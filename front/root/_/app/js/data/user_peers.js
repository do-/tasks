////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_peers = async function (e) {

    await response ({type: 'users', action: 'set_peers'}, {data: {ids: w2ui ['user_peers_grid'].getSelection ()}})

    w2popup.close ()

    alert ('OK')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_peers = async function (o) {

    let data = await response ({type: 'users', id: undefined, part: 'peers'})
    
    return {users: dia2w2uiRecords (data.users)}

}