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
				allowSorting: false,
			},
			{
				dataField: 'label',
				caption: 'Заголовок сообщения',
				allowHeaderFiltering: false,
				allowSorting: false,
			},
			{
				dataField: 'id_user_from',
				caption: 'Автор',
				allowSorting: false,
				allowFiltering: false,
				allowHeaderFiltering: true,
				headerFilter: {
					allowSearch: true,
				},
				lookup: {
					dataSource: data.users,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
			{
				dataField: 'id_user_to',
				caption: 'Адресат',
				allowSorting: false,
				allowFiltering: false,
				allowHeaderFiltering: true,
				headerFilter: {
					allowSearch: true,
				},
				lookup: {
					dataSource: data.users,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
			{
				dataField: 'task_label',
				caption: 'Тема задачи',
				allowSorting: false,
				allowHeaderFiltering: false,
			},
			{
				dataField: 'id_voc_project',
				caption: 'Проект',
				allowSorting: false,
				allowFiltering: false,
				allowHeaderFiltering: true,
				lookup: {
					dataSource: data.voc_projects,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},
			{
				dataField: 'is_open',
				dataType: 'boolean',
				caption: 'Статус задачи',
				allowSorting: false,
				allowHeaderFiltering: false,
				trueText: 'В работе',
				falseText: 'Закрыта',
				showEditorAlways: false,
			},
		],	
		
		filterRow: {
			visible: true,
		},
		
		filterPanel: { 
			visible: true 
		},
		
		headerFilter: {
			visible: true,
		},
		
		searchPanel: {
			visible: true,
			width: 500,
		},
		
        toolbar: {
            items: [             
            	{
	            	text: '\xa0\xa0\xa0Переписка (отдельные реплики, не задачи)',
	           		location: 'before',
            	},
            	{
	            	name: 'searchPanel',
	           		location: 'after',
            	},
            	{
	            	text: '',
	           		location: 'after',
            	},
            ]  
        },	
        
		onRowDblClick: e => open_tab ('/tasks/' + e.data.id_task),

	}).dxDataGrid ('instance')
        
}