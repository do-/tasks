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

	}).dxDataGrid ('instance')
    

/*
    let $result = $('main').html (await to_fill ('task_notes', data))
    
    let grid = $("#grid_task_notes").draw_table ({

        columns: [
            {field: 'ts',           name: 'Дата',      minWidth: 100, maxWidth: 100, formatter: _ts, filter: {type: 'dates', dt_from: 'YYYY-MM-01', dt_to: 'YYYY-MM-DD'}},
            {field: 'label',        name: 'Заголовок сообщения', cssClass: 'clickable', width: 100, filter: {type: 'text', title: '[Поиск]'}},
            {field: 'id_user_from', name: 'Автор',     width: 30, voc: data.users, filter: {type: 'checkboxes'}},
            {field: 'id_user_to',   name: 'Адресат',   width: 30, voc: data.users, filter: {type: 'checkboxes'}},
            {field: 'tasks.label',  name: 'Тема задачи', width: 100, filter: {type: 'text', title: '[Поиск]'}},
            {field: 'tasks.id_voc_project',    name: 'Проект',            width: 50, voc: data.voc_projects, filter: {type: 'checkboxes'}},
        ],
        
        searchInputs: 
            darn ($(".toolbar :input").toArray ())
        ,
        
        src: data.src,

        onRecordDblClick: (r) => open_tab ('/tasks/' + r.id_task),

        onClick: (e, a) => {
        	if (a.cell == 1) open_tab ('/tasks/' + a.grid.getDataItem (a.row) ['tasks.uuid'])
        },

    })
    
    $(".toolbar input:first").focus ()

    return $result
*/    
}