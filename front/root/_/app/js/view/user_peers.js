$_DRAW.user_peers = async function (data) {

	let form
	
	const $div = $('<div>').appendTo ($('main'))

	const popup = $div.dxPopup({
	    width: 600,
	    height: 125,
	    container: 'main',
		showTitle: true,
		title: 'Мои корреспонденты',
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
						await $_DO.update_user_peers (data)
						popup.dispose ()
						$div.remove ()
					}
				}
			},
		],
	}).dxPopup ('instance')

	form = popup.content().dxForm ({
		formData: data,
		items: [
			{
				dataField: 'ids',
				editorType: 'dxTagBox',				
                label: {
                    text: 'вот эти',
                },
                editorOptions: {
					dataSource: data.users,
					displayExpr: 'label',
					valueExpr: 'uuid',					
				},
			},
		]
	}).dxForm ('instance')

}