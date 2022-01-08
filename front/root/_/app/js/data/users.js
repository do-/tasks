////////////////////////////////////////////////////////////////////////////////

$_DO.create_users = function (e) {

    show_block ('user_new')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_users = async function (id, data) {

	await response ({type: 'users', id, action: 'update'}, {data})

}

////////////////////////////////////////////////////////////////////////////////

$_DO.load_users = async function (lo) {

	const {skip, take, sort, filter} = lo

	let o = {
		searchLogic: "AND",
		limit:take,
		offset:skip,
		search: [
			{
				"field": "is_deleted",
				"value": "0",
				"operator": "is"
			},
		],
	}
	
	if (filter) o.search.push ({
        "field": "q",
        "value": filter [0].filterValue,
        "operator": "contains"
	})
	
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
		load: $_DO.load_users,
		update: $_DO.update_users,
	})

    return data

}