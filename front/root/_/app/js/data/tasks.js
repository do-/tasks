////////////////////////////////////////////////////////////////////////////////

$_DO.create_tasks = function (e) {

    show_block ('tasks_new')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.show_required_tasks = function () {

	$('body > main').dxDataGrid ('instance').option ('filterValue', ['id_user', '=', $_USER.id])
    
}    

////////////////////////////////////////////////////////////////////////////////

$_DO.show_created_tasks = function () {

	$('body > main').dxDataGrid ('instance').option ('filterValue', 
		[
			['id_user_author', '=', $_USER.id],
			'and',
			['id_status', '=', 101],
		]
	)

}

////////////////////////////////////////////////////////////////////////////////

$_DO.load_tasks = async function (loadOptions) {

	const {tasks, cnt} = await response ({type: 'tasks', id: null}, {loadOptions})

	return {
		data: tasks,
		totalCount: parseInt (cnt),
	}

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks = async function (o) {

    let data = await response ({part: 'vocs'})
    
    {
    
    	const {id} = $_USER
    
		data.users = data.users.filter (i => i.id !== id)

		data.users.unshift ({id, label: '(я)'})
		
		data.authors = clone (data.users)
		
		data.executors = clone (data.users)
		data.executors [0].label = '(мне)'
		data.users [0].label = '(на мне)'
    
    }    
        
    data.others = data.users.filter ((r) => r.id != $_USER.id)
    
    data.note = $_SESSION.delete ('note')

    $('body').data ('data', data)

    let e = Object.entries (o); if (!e.length && !data.note) e = [['id_user', [$_USER.uuid]]]
    
    data.src = new DevExpress.data.CustomStore ({
		key: 'uuid',
		load:   $_DO.load_tasks,
	})

    return data

}