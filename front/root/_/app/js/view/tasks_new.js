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
					onClick: async () => {
						const data = form.option ('formData')
						await $_DO.update_tasks_new (data)
						popup.dispose ()
						$div.remove ()
					}
				}
			},
		],
		
		onShown: () => form.getEditor ('label').focus ()

	}).dxPopup ('instance')

	form = popup.content().dxForm ({
		formData: data,
		items: [
			{
				dataField: 'label',
				isRequired: true,
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
				editorType: 'dxTextArea',				
                label: {
                    text: 'Суть',
                },
                editorOptions: {
                	height: 220,
				},
			},

		]
	}).dxForm ('instance')

//    $('#img', $view).show_block ('img')

}