////////////////////////////////////////////////////////////////////////////////

$_DO.add_user_peers = async function () {

	$('#grid_available').data ('grid').moveSelectedDataTo ($('#grid_selected').data ('grid'))

}

////////////////////////////////////////////////////////////////////////////////

$_DO.del_user_peers = async function () {

	$('#grid_selected').data ('grid').moveSelectedDataTo ($('#grid_available').data ('grid'))

}

////////////////////////////////////////////////////////////////////////////////

$_DO.move_user_peers = async function (from, to) {

	let grid_from = $(from).data ('grid')
	let grid_to = $(to).data ('grid')
	
	grid_from.moveSelectedDataTo (grid_to)
	
}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_peers = async function (e) {

    get_popup ().block ()

    await response ({type: 'users', action: 'set_peers'}, {data: {
    	ids: $('#grid_selected').data ('grid').getData ().map (i => i.uuid)
    }})

    $_USER.peers = (await response ({type: 'users', id: null, part: 'peers'}))
        .users.filter (i => i ['user_user.id_user'])

    $_SESSION.set ('user', $_USER)
    $_LOCAL.set ('user', $_USER)   

    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_peers = async function (o) {

    let data = await response ({type: 'users', id: null, part: 'peers'})

    data.u = [[], []]

    for (let user of data.users) data.u [user ['user_user.id_user'] ? 1 : 0].push (user)
darn (data)    
    return data

}