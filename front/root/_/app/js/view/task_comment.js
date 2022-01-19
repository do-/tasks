/*

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
*/
$_DRAW.task_comment = async function (data) {

    let it = data.record
    
    it.users = ((users) => {
    
        if (it.is_assigning) return users

        if ($_USER.id == data.author.id) users.push ({id: "0", text: 'Никто. Дело окончено.'})
        
        for (let i of users) if (i.id == $_USER.id) i.text = 'Я, ' + i.text
        
        return users
        
    }) (clone (data.users.items))
/*
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
*/

	let form
	
	const $div = $('<div>').appendTo ($('main'))

	const popup = $div.dxPopup({
	    width: 650,
	    height: 400,
	    container: 'main',
		showTitle: true,
		title: 'Комментарий',
		visible: true,
		dragEnabled: true,
		closeOnOutsideClick: true,
		showCloseButton: true,
		position: {
		  at: 'center',
		  my: 'center',
		},	    
		toolbarItems: [			
			{
				widget: "dxButton",
				toolbar: 'bottom',
				location: "after",
				options: { 
					text: "Ctrl-Enter", 
					onClick: async () => {
						const data = form.option ('formData')
						await $_DO.update_task_comment (data)
						popup.dispose ()
						$div.remove ()
					}
				}
			},
		],
		
		onShown: () => form.getEditor ('label').focus ()

	}).dxPopup ('instance')

	form = popup.content().dxForm ({
		formData: it,
		items: [
			{
				dataField: 'id_user_to',
				isRequired: true,
				editorType: 'dxSelectBox',				
                label: {
                    text: 'Кто этим займётся',
                },
                editorOptions: {
					dataSource: it.users,
					displayExpr: 'text',
					valueExpr: 'id',					
				},
			},
			{
				dataField: 'label',
				isRequired: true,
                label: {
                    text: 'Заголовок',
                },
			},			
			{
				dataField: 'body',
				editorType: 'dxHtmlEditor',				
                label: {
                    text: 'Сообщение',
                },
                editorOptions: {
                	height: 220,
				},
			},

		]
	}).dxForm ('instance')	

}