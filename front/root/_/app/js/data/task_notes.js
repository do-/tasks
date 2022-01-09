////////////////////////////////////////////////////////////////////////////////

$_DO.load_task_notes = async function (lo) {
darn ({lo})
	const {skip, take, sort, filter} = lo

	let o = {
		searchLogic: "AND",
		limit:take,
		offset:skip,
		search: [
/*
			{
				"field": "is_deleted",
				"value": $_SESSION.get ('is_deleted') || null,
				"operator": "is"
			},
*/			
		],
	}
/*	
	if (filter) o.search.push ({
        "field": "q",
        "value": filter [0].filterValue,
        "operator": "contains"
	})
*/	
	const {task_notes, cnt} = await response ({type: 'task_notes', id: null}, o)
	
	for (let i of task_notes) {
		i ['tasks_label'] = i ['tasks.label']
		i ['tasks_id_voc_project'] = i ['tasks.id_voc_project']
	}

	return {
		data: task_notes,
		totalCount: parseInt (cnt),
	}

}


////////////////////////////////////////////////////////////////////////////////

$_GET.task_notes = async function (o) {

    let data = await response ({part: 'vocs'})
    
    add_vocabularies (data, {users: 1, voc_projects: 1})
    
    data.src = new DevExpress.data.CustomStore ({
		key: 'uuid',
		load:   $_DO.load_task_notes,
	})

    return data

}