$_DRAW.tasks = async function (data) {

    $('title').text ('Дела')
    
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
				dataField: 'id_voc_project',
				caption: 'Проект',
				dataType: 'text',
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
				dataField: 'label',
				dataType: 'text',
				caption: 'Тема',
				allowSearch: false,
				allowHeaderFiltering: false,
				allowSorting: false,
			},
			{
				dataField: 'id_user_author',
				dataType: 'text',
				caption: 'Автор',
				allowSorting: false,
				allowFiltering: false,
				allowHeaderFiltering: true,
				headerFilter: {
					allowSearch: true,
				},
				lookup: {
					dataSource: data.authors,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},		
			{
				dataField: 'id_user_executor',
				dataType: 'text',
				caption: 'Адресат',
				allowSorting: false,
				allowFiltering: false,
				allowHeaderFiltering: true,
				headerFilter: {
					allowSearch: true,
				},
				lookup: {
					dataSource: data.executors,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},	
			{
				dataField: 'id_status',
				dataType: 'int',
				caption: 'Статус',
				allowSorting: false,
				allowFiltering: false,
				allowHeaderFiltering: true,
				lookup: {
					dataSource: data.voc_task_status,
					valueExpr: 'id',
					displayExpr: 'label',
 				}
			},			
			{
				dataField: 'id_user',
				dataType: 'text',
				caption: 'На ком',
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
				dataField: 'task_note_label',
				dataType: 'text',
				caption: 'Последняя реплика',
				allowSearch: false,
				allowHeaderFiltering: false,
				allowSorting: false,
			},			
			{
				dataField: 'task_note_ts',
				dataType: 'datetime',
				caption: 'от',
				dataType: 'datetime',
				allowHeaderFiltering: false,
				allowSorting: false,
			},			
			{
				dataField: 'note',
				dataType: 'text',
				caption: 'Ключевое слово',
				allowSearch: true,
				filterOperations: ['contains'],
				visible: false,
			},			
			{
				type: 'buttons',
				visible: false,
			},			
		],
		
		filterValue: data.note ? [] : ['id_user', '=', $_USER.id],		
		
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
			text: data.note,
			placeholder: 'Поиск с учётом переписки',
		},

		onRowDblClick: e => open_tab ('/tasks/' + e.key),
		
		onContextMenuPreparing: e => { 
		
			if (e.target !== 'content') return
			
			const {column: {lookup, dataField}} = e; if (!lookup) return
			
		    function already (a) {
		    
		    	if (!a || !Array.isArray (a)) return false
		    	
		    	if (a.length === 3) {
		    	
		    		const [x, op, y] = a
		    		
		    		if (!Array.isArray (x)) return x == dataField

		    		if (already (x)) return true

		    		if (already (y)) return true
		    		
		    	}
		    	else {
		    	
		    		for (const i of a) if (already (a)) return true
		    	
		    	}
		    	
		    	return false
		    
		    }

			let filterValue = grid.option ('filterValue'); if (already (filterValue)) return

			const id = e.row.data [dataField]

			const item = lookup.dataSource.find (i => i.id == id)
			
			if (!e.items) e.items = []

		    e.items.push ({
		    
		        text: 'Только ' + item.label,
		        
		        onItemClick: function () {
		        
					const term = [dataField, '=', item.id]
										
					filterValue = !filterValue ? term : [filterValue, 'and', term]
					
					grid.option ('filterValue', filterValue)

		        }

		    })

        },
		
		toolbar: {
		    items: [             
		    	{
		        	text: '\xa0\xa0\xa0Задачи (+ последняя реплика для каждой)',
		       		location: 'before',
		    	},
		    	{
		        	widget: 'dxButton',
		       		location: 'after',
		       		options: {
		       			text: 'Что на мне?',
		       			onClick: $_DO.show_required_tasks,
		       		},
		    	},
		    	
		    	{
		        	widget: 'dxButton',
		       		location: 'after',
		       		options: {
		       			text: 'Чего я жду?',
		       			onClick: $_DO.show_created_tasks,
		       		},
		    	},
		    	
		    	{
		        	name: 'searchPanel',
		       		location: 'after',
		       		options: {
		       			placeholder: 'Поиск с учётом переписки',
		       		},
		    	},
		    	{
		        	widget: 'dxButton',
		       		location: 'after',
		       		options: {
		       			text: 'Создать...',
		       			onClick: $_DO.create_tasks,
		       		},
		    	},
		    	{
		        	text: '',
		       		location: 'after',
		    	},
		    ]  
		},
		
	}).dxDataGrid ('instance')

    window.addEventListener ('storage', e => {

    	if (e.key == 'task_comment') grid.refresh ()

    })	

}