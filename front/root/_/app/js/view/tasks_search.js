$_DRAW.tasks_search = async function (data) {

	let form
	
	const $div = $('<div>').appendTo ($('main'))

	const popup = $div.dxPopup({
	    width: 800,
	    height: 125,
	    container: 'main',
		showTitle: true,
		title: 'Найти/открыть',
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
					text: "Enter", 
					onClick: async () => {
						const data = form.option ('formData')
						await $_DO.update_tasks_search (data)
						popup.dispose ()
						$div.remove ()
					}
				}
			},
		],
		onShown: () => form.getEditor ('q').focus ()
	}).dxPopup ('instance')

	form = popup.content().dxForm ({
		formData: data,
		items: [
			{
				dataField: 'q',
                label: {
                    text: 'Строка поиска или UUID',
                },
			},
		]
	}).dxForm ('instance')
	
	form.getEditor ('q').registerKeyHandler ('enter', 

		e => $_DO.update_tasks_search ({q: e.target.value})

	)

}