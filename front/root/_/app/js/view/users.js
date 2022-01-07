$_DRAW.users = async function (data) {
    
    $('title').text ('Пользователи системы')
    
    let $result = $('main').html (await use.html ('users'))

	$('#grid_users').dxDataGrid({
		dataSource: data.src,
		showBorders: true,
		showRowLines: true,
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
			//            {field: "id_role", name: "Роль", width: 50, voc: data.roles},    
		],
		onRowDblClick: e => open_tab ('/users/' + e.data.uuid),    
	}).dxDataGrid('instance');

    return $result

}