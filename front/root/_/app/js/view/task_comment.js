$_DO.add_user_task_comment = async function ($select, user) {

	let ops = $('option', $select).toArray ().filter (i => i.value).map (({value, text}) => ({value, text}))
	
	let first = ops.shift (), last = ops.pop ()
	
	if (!ops.find (i => i.value == user.id)) ops.push ({value: user.id, text: user.label})
	
	ops.sort ((a, b) => a.text < b.text ? -1 : a.text > b.text ? 1 : 0)
	
	ops.unshift (first)
	ops.push (last)
	
	$select.empty ()
	
	for (let {value, text} of ops) $('<option>').text (text).attr ({value}).appendTo ($select)
	
	$select.val (user.id)

	$select.selectmenu ('refresh')

}

$_DO.extend_users_task_comment = async function (e) {

	show_block ('user_aliens', {
	
		set: r => $_DO.add_user_task_comment ($(e.target), r)
		
	})

}

$_DRAW.task_comment = async function (data) {

    let it = data.record
    
    it.users = ((users) => {
    
        if (it.is_assigning) return users
        
        if ($_USER.id == data.author.id) users.push ({id: "0", text: 'Никто. Дело окончено.'})
        
        for (let i of users) if (i.id == $_USER.id) i.text = 'Я, ' + i.text
        
        return users
        
    }) (clone (data.users.items))

	let $view = await draw_popup ('task_comment', it)

    $('select', $view).selectmenu ({
    	width: true,
    	change: (e, ui) => {
    		if (ui.item.value == 'other') $_DO.extend_users_task_comment (e)
    	}
	})
    
    $('#img', $view).show_block ('img')

    $('textarea', $view).focus ()    

    return $view

}