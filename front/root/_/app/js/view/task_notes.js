define ([], function () {
    
    return function (data, view) {
    
        $('title').text ('Дела')

        $('main').w2regrid ({ 
        
            name: 'task_notesGrid',             
            
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: true,
            },

            columns: [

                {field: 'ts',                caption: 'Дата',      size: 40, render: function (i) {return i.ts.substring (0,19)}},
                {field: 'label',             caption: 'Тема',      size: 100},
                {field: 'id_user_from', caption: 'Автор',          size: 30, render: function (i) {return data.users [i.id_user_from]}},
                {field: 'id_user_to', caption: 'Адресат',          size: 30, render: function (i) {return data.users [i.id_user_to]}},

            ],
                        
            url: '_back/?type=task_notes',
            
        }).refresh ();
        
        $('#grid_task_notesGrid_search_all').focus ()

    }

})