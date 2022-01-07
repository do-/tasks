$_DRAW.users = async function (data) {
    
    $('title').text ('Пользователи системы')
    
    let $result = $('main').html (await use.html ('users'))

	$('#grid_users').dxDataGrid({

		dataSource: data.src,

		showBorders: true,
		showRowLines: true,
		hoverStateEnabled: true,
		focusedRowEnabled: true,
		remoteOperations: true, 
		allowColumnResizing: true,

		pager: {
			visible: true,
			showInfo: true,
			showNavigationButtons: false,
		},

		scrolling: {
			mode: 'virtual',
		},

		searchPanel: {
			visible: true,
		},

		columns: [
			{
				dataField: 'label',
				caption: 'ФИО',
				dataType: 'string',
				sortOrder: 'asc',
			},
			{
				dataField: 'login',
				caption: 'Login',
				dataType: 'string',
			},
			{
				dataField: 'mail',
				caption: 'E-mail',
				dataType: 'string',
			},
			{
				dataField: 'id_role',
				caption: 'Роль',
				lookup: {
					dataSource: data.roles.items,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
		],

		onRowDblClick: e => open_tab ('/users/' + e.data.uuid),    
		
		onKeyDown: e => {
		
			if (e.event.which !== 13) return
			
			open_tab ('/users/' + e.component.option ('focusedRowKey'))
		
		}

	}).dxDataGrid('instance');

    return $result

}