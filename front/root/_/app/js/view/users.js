$_DRAW.users = async function (data) {

    $('title').text ('Пользователи системы')

    $('main').w2regrid ({ 
    
        name: 'usersGrid',             
        
        show: {
            toolbar: true,
            footer: true,
            toolbarAdd: true,
        },            

        columns: [                
            {field: 'label',   caption: 'ФИО',    size: 100, sortable: true},
            {field: 'login',   caption: 'Login',  size: 50,  sortable: true},
            {field: 'id_role', caption: 'Роль',   size: 50,  voc: data.roles},
            {field: 'mail',    caption: 'E-mail', size: 50,  sortable: true},
        ],
                    
        url: '_back/?type=users',

        onAdd: function (e) {show_block ('user_new')},

    }).refresh ();
    
    $('#grid_usersGrid_search_all').focus ()

}