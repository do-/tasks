////////////////////////////////////////////////////////////////////////////////

$_DO.update_tasks_search = async function (e) {

    let {q} = get_popup ().valid_data (); close_popup ()

    let [id] = q.match (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/) || []

    if (id) {
            
        let data = await response ({type: 'tasks', id})
        
        if (data [0].uuid == id) return open_tab ('/tasks/' + id)
    
    }
    
    $_SESSION.set ('note', q)
    
    open_tab ('/tasks')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks_search = async function (o) {

	let data = clone (o)
	
	if (!o.q && $_REQUEST.type == 'tasks') data.q = $('body').data ('data').note

    return data

}