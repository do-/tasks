$_DRAW.users = async function (data) {
    
    $('title').text ('Пользователи системы')
    
    let $result = $('main').html (await use.html ('users'))

    let grid = $("#grid_users").draw_table ({

        columns: [
            {field: "label", name: "ФИО", width: 200, sortable: true},
            {field: "login", name: "Login", width: 50, sortable: true},
            {field: "mail", name: "E-mail", width: 100, sortable: true},
            {field: "id_role", name: "Роль", width: 50, voc: data.roles},
        ],
        
        searchInputs: 
            $(".toolbar :input").toArray ()
        ,
        
        url: {type: 'users'},

        onDblClick: (e, a) => open_tab ('/users/' + a.grid.getDataItem (a.row).uuid)

    })
    
    $(".toolbar input:first").focus ()

    return $result

}