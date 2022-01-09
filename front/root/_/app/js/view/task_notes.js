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
			},
			{
				dataField: 'label',
				caption: 'Заголовок сообщения',
			},
			{
				dataField: 'id_user_from',
				caption: 'Автор',
				lookup: {
					dataSource: data.users.items,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
			{
				dataField: 'id_user_to',
				caption: 'Адресат',
				lookup: {
					dataSource: data.users.items,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
			{
				dataField: 'tasks_label',
				caption: 'Тема задачи',
			},
			{
				dataField: 'tasks_id_voc_project',
				caption: 'Проект',
				lookup: {
					dataSource: data.voc_projects.items,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
		],		

		onRowDblClick: e => open_tab ('/tasks/' + e.data.id_task),

	}).dxDataGrid ('instance')
        
}