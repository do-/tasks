$_DRAW.task_comment = async function (data) {

    let it = data.record
    
    it.users = ((users) => {
    
        if (it.is_assigning) return users

        if ($_USER.id == data.author.id) users.push ({id: "0", text: 'Никто. Дело окончено.'})
        
        for (let i of users) if (i.id == $_USER.id) i.text = 'Я, ' + i.text
        
        return users
        
    }) (clone (data.users.items))

	let form
	
	const popup = $('<div>').appendTo ($('main')).dxPopup({
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
					onClick: $_DO.update_task_comment
				}
			},
		],
		
		onShown: () => form.getEditor ('label').focus ()

	}).dxPopup ('instance')
	
	popup.on ('hiding', ({component}) => {
		component.dispose ()
		component._$element.remove ()
	})	

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
                editorOptions: {
					maxLength: 40,
				},
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

	popup._$element.on ('keyup', e => {
	
		if (e.key === 'Escape') return popup.hide ()

		if (e.ctrlKey && e.key === 'Enter') $_DO.update_task_comment ()
		
	})

}