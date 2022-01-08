$_DRAW.user_password = async function (data) {

	let form
	
	const $div = $('<div>').appendTo ($('main'))

	const popup = $div.dxPopup({
	    width: 300,
	    height: 155,
	    container: 'main',
		showTitle: true,
		title: 'Смена пароля',
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
					text: "Сохранить", 
					onClick: async () => {
						const data = form.option ('formData')
						await $_DO.update_user_password (data)
						popup.dispose ()
						$div.remove ()
					}
				}
			},
		],
	}).dxPopup ('instance')

	form = popup.content().dxForm ({
		formData: {id: data.uuid},
		items: [
			{
				dataField: 'p1',
				isRequired: true,
                label: {
                    text: 'Пароль',
                },
                editorOptions: {
					mode: 'password',
				},
			},
			{
				dataField: 'p2',
				isRequired: true,
                label: {
                    text: 'Повтор',
                },
                editorOptions: {
					mode: 'password',
				},
			},
		]
	}).dxForm ('instance')

}