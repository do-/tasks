////////////////////////////////////////////////////////////////////////////////

$_DO.load_task_notes = async function (loadOptions) {

	const {task_notes, cnt} = await response ({type: 'task_notes', id: null}, {loadOptions})

	return {
		data: task_notes,
		totalCount: parseInt (cnt),
	}

}


////////////////////////////////////////////////////////////////////////////////

$_GET.task_notes = async function (o) {

    let data = await response ({part: 'vocs'})
    
    {
    
    	const {id} = $_USER
    
		data.users = data.users.filter (i => i.id !== id)

		data.users.unshift ({id, label: '(Я)'})
    
    }
            
    data.src = new DevExpress.data.CustomStore ({
		key: 'uuid',
		load:   $_DO.load_task_notes,
	})

    return data

}