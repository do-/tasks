$_DRAW.users = async function (data) {
    
    $('title').text ('Пользователи системы')
    
//    let $result = $('main').html (await use.html ('users'))

	const grid = $('body > main').dxDataGrid({

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

		editing: {
		  mode: 'popup',
		  allowUpdating: true,
		  useIcons: true,
		  popup: {
			title: 'Пользователь',
			showTitle: true,
			width: 400,
			height: 220,
			toolbarItems: [
				{
					widget: "dxButton",
					toolbar: 'bottom',
					location: "after",
					options: { 
						text: "Установить пароль...", 
						onClick: async e => {
							const data = await grid.byKey (grid.option ('focusedRowKey'))
							grid.cancelEditData ()
							show_block ('user_password', data)
						}
					}
				},			
				{
					widget: "dxButton",
					toolbar: 'bottom',
					location: "after",
					options: { 
						text: "Сохранить", 
						onClick: async () => {
							if (!await DevExpress.ui.dialog.confirm ('Сохранить изменения?', 'Вопрос')) return
							grid.saveEditData ()
						}
					}
				},
				{
					widget: "dxButton",
					toolbar: 'bottom',
					location: "after",
					options: { 
						text: "Удалить", 
						onClick: function (e) { /* ... */ }
					}
				},
			],
		  }, 
		  form: {colCount: 1,
			items: [
				{
					dataField: 'label',
					isRequired: true,
				},
				{
					dataField: 'login',
					isRequired: true,
				},        	
				{
					dataField: 'mail',
					isRequired: true,
					editorOptions: {
						mode: 'email',
					},
				},        	
			], 
		  },
	//      allowDeleting: true,
	//      allowAdding: true,
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

//		onRowDblClick: e => open_tab ('/users/' + e.data.uuid),    
		onRowDblClick: function (e) {this.editRow (e.rowIndex)},    
		
		onKeyDown: e => {
		
			if (e.event.which !== 13) return
			
			open_tab ('/users/' + e.component.option ('focusedRowKey'))
		
		}

	}).dxDataGrid('instance');

//    return $result

}