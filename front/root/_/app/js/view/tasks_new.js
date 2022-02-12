$_DRAW.tasks_new = async function (data) {

darn (data)

	let form
	
	const $div = $('<div>').appendTo ($('main'))

	const popup = $div.dxPopup({
	    width: 650,
	    height: 400,
	    container: 'main',
		showTitle: true,
		title: 'Новое дело',
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
					onClick: $_DO.update_tasks_new
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
		formData: data,
		items: [
			{
				dataField: 'label',
				isRequired: true,
                editorOptions: {
					maxLength: 40,
				},
                label: {
                    text: 'Тема',
                },
			},
			{
				dataField: 'id_voc_project',
				isRequired: true,
				editorType: 'dxSelectBox',				
                label: {
                    text: 'Проект',
                },
                editorOptions: {
					dataSource: data.voc_projects,
					displayExpr: 'label',
					valueExpr: 'id',					
				},
			},
			{
				dataField: 'body',
				isRequired: true,
				editorType: 'dxHtmlEditor',				
                label: {
                    text: 'Суть',
                },
                editorOptions: {
                	height: 220,
				},
			},

		]
	}).dxForm ('instance')

	popup._$element.on ('keyup', e => {
	
		if (e.key === 'Escape') return popup.hide ()

		if (e.ctrlKey && e.key === 'Enter') $_DO.update_tasks_new ()
		
	})

}