////////////////////////////////////////////////////////////////////////////////

$_DO.add_user_peers = async function () {

	$_DO.move_user_peers ('#grid_available', '#grid_selected')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.del_user_peers = async function () {

	$_DO.move_user_peers ('#grid_selected', '#grid_available')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.move_user_peers = async function (from, to) {

	let grid_from = $(from).data ('grid')
	let grid_to = $(to).data ('grid')

	let a = clone (grid_from.getData ())
	let s = clone (grid_to.getData ())
	let n = clone (grid_from.getSelectedRows ()).reverse ()

	for (let i of n) s.push (a.splice (i, 1) [0])

	grid_from.setData (a)
	grid_from.setSelectedRows ([])
	grid_from.render ()

	grid_to.setData (s.sort ((a, b) => a.label > b.label ? 1 : a.label < b.label ? -1 : 0))
	grid_to.setSelectedRows ([])
	grid_to.render ()

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