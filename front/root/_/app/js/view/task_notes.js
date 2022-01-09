$_DRAW.task_notes = async function (data) {

    $('title').text ('Переписка')
    
	const grid = $('body > main').css ({'padding-top': 5}).dxDataGrid ({

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
		
		columns: [
			{
				dataField: 'ts',
				caption: 'Дата',
				dataType: 'datetime',
				allowHeaderFiltering: false,
			},
			{
				dataField: 'label',
				caption: 'Заголовок сообщения',
				allowHeaderFiltering: false,
			},
			{
				dataField: 'id_user_from',
				caption: 'Автор',
				allowFiltering: false,
				allowHeaderFiltering: true,
				lookup: {
					dataSource: data.users.items,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
			{
				dataField: 'id_user_to',
				caption: 'Адресат',
				allowFiltering: false,
				allowHeaderFiltering: true,
				lookup: {
					dataSource: data.users.items,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
			{
				dataField: 'task_label',
				caption: 'Тема задачи',
				allowHeaderFiltering: false,
			},
			{
				dataField: 'id_voc_project',
				caption: 'Проект',
				allowFiltering: false,
				allowHeaderFiltering: true,
				lookup: {
					dataSource: data.voc_projects.items,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
		],	
		
		filterRow: {
			visible: true,
		},
		
		headerFilter: {
			visible: true,
		},
		
		onRowDblClick: e => open_tab ('/tasks/' + e.data.id_task),

	}).dxDataGrid ('instance')
        
}