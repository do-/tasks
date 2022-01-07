$_DRAW.users = async function (data) {
    
    $('title').text ('Пользователи системы')
    
    let $result = $('main').html (await use.html ('users'))
    
const store = new DevExpress.data.CustomStore ({

    key: 'uuid',
    load: async loadOptions => {
darn (loadOptions)
		const {skip, take, sort} = loadOptions

		let o = {
			searchLogic: "AND",
			limit:take,
			offset:skip,
			search: [],
		}

		if (sort) o.sort = sort.map (i => ({
			field: i.selector,
			direction: i.desc ? 'desc' : 'asc',
		}))

		const {users, cnt} = await response ({type: 'users', id: null}, o)

		return {
			data: users,
			totalCount: cnt,
		}

    },

})

  $('#grid_users').dxDataGrid({
    dataSource: store,
    showBorders: true,
    remoteOperations: true,
    paging: {
      pageSize: 12,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [8, 12, 20],
    },
    columns: [
    {
      dataField: 'label',
      caption: 'ФИО',
      dataType: 'string',
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