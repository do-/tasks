$_DRAW.users = async function (data) {
    
    $('title').text ('Пользователи системы')

	let toolbarItems = []
		
	function fill_in (is_new) {
	
		toolbarItems.splice (0, toolbarItems.length)
		
		const common = {
			widget: "dxButton",
			location: "after",
		}
		
		if (!is_new) toolbarItems.push ({...common,
			toolbar: 'top',
			options: { 
				text: "Установить пароль...", 
				onClick: async e => {
					const data = await grid.byKey (grid.option ('focusedRowKey'))
					grid.cancelEditData ()
					show_block ('user_password', data)
				}
			}
		})
		
		if (is_new) {

			toolbarItems.push ({...common,
				toolbar: 'bottom',
				options: { 
					text: 'Создать', 
					onClick: async () => {
						if (!await DevExpress.ui.dialog.confirm ('Создать новую учётную запись?', 'Вопрос')) return
						grid.saveEditData ()
					}
				}
			})

		}
		else {

			toolbarItems.push ({...common,
				toolbar: 'bottom',
				options: { 
					text: 'Сохранить', 
					onClick: async () => {
						if (!await DevExpress.ui.dialog.confirm ('Сохранить изменения?', 'Вопрос')) return
						grid.saveEditData ()
					}
				}
			})

		}
		
	}
    
	const grid = $('body > main').css ({'margin-top': 5}).dxDataGrid ({

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

		onInitNewRow: () => fill_in (true),	 
		onEditingStart: () => fill_in (false),

		editing: {
		  mode: 'popup',
		  allowUpdating: true,
		  useIcons: true,
		  
		  popup: {
			title: 'Пользователь',
			showTitle: true,
			closeOnOutsideClick: true,
			width: 400,
			height: 240,
			toolbarItems,
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
				{
					dataField: 'id_role',
					isRequired: true,
				},        	
			], 
		  },
	//      allowDeleting: true,
			allowAdding: true,
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

		onRowDblClick: e => $_DO.edit_users (),
		
		onKeyDown: e => {
		
			if (e.event.which === 13) $_DO.edit_users ()
		
		}

	}).dxDataGrid ('instance')
	
	$_DO.edit_users = function () {

		grid.editRow (grid.option ('focusedRowIndex'))

	}	

}