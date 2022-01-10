////////////////////////////////////////////////////////////////////////////////

$_DO.create_tasks = function (e) {

    show_block ('tasks_new')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.show_required_tasks = function () {

    show_block ('tasks', {
        id_user: [$_USER.id],
    })
    
}    

////////////////////////////////////////////////////////////////////////////////

$_DO.show_created_tasks = function () {

    show_block ('tasks', {
        id_status: [101],
        id_user_author: [$_USER.id]
    })

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
    
//    add_vocabularies (data, {users: 1, voc_task_status: 1, voc_projects: 1})
    
    data.others = data.users.filter ((r) => r.id != $_USER.id)
    
    data.note = $_SESSION.delete ('note')

    $('body').data ('data', data)

    let e = Object.entries (o); if (!e.length && !data.note) e = [['id_user', [$_USER.uuid]]]

//	let search = e.map (fv => {[field, value] = fv; darn ({field, value}); return {field, value, operator: 'in'}})

//    data.src = [$_REQUEST.type, {search}]
    
    data.src = new DevExpress.data.CustomStore ({
		key: 'uuid',
		load:   $_DO.load_tasks,
	})

    return data

}