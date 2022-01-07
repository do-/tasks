////////////////////////////////////////////////////////////////////////////////

$_DO.create_users = function (e) {

    show_block ('user_new')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.load_users = async function (lo) {

	const {skip, take, sort} = lo

	let o = {
		searchLogic: "AND",
		limit:take,
		offset:skip,
		search: [],
	}

	if (sort) o.sort = sort.map (i => ({
		field: i.selector,
		direction: i.desc ? 'desc' : 'asc',
	}))

	const {users, cnt} = await response ({type: 'users', id: null}, o)

	return {
		data: users,
		totalCount: parseInt (cnt),
	}

}

////////////////////////////////////////////////////////////////////////////////

$_GET.users = async function (o) {

    let data = await response ({type: 'users', part: 'vocs'})
    
    add_vocabularies (data, {roles: 1})
    
    $('body').data ('data', data)
            
    data.src = new DevExpress.data.CustomStore ({
		key: 'uuid',
		load: $_DO.load_users
	})

    return data

}