define ([], function () {
    
    return function (data, view) {
    
        $('title').text ('Всеобщая переписка')

        $('main').w2regrid ({ 
        
            name: 'task_notesGrid',             
            
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: true,
            },

            searches: [
                {field: 'note',    caption: 'Содержимое', type: 'text'},
                {field: 'id_user_from', caption: 'Автор', type: 'enum', options: {items: data.users.items}},
                {field: 'id_user_to', caption: 'Адресат', type: 'enum', options: {items: data.users.items}},
                {field: 'ts',    caption: 'Дата', type: 'date'},
            ],

            columns: [

                {field: 'ts',                caption: 'Дата',      size: 20, render: function (i) {return i.ts.substring (0,19)}},
                {field: 'label',             caption: 'Заголовок',      size: 100},
                {field: 'id_user_from', caption: 'Автор',          size: 30, render: function (i) {return data.users [i.id_user_from]}},
                {field: 'id_user_to', caption: 'Адресат',          size: 30, render: function (i) {return data.users [i.id_user_to]}},

            ],
                        
            url: '_back/?type=task_notes',
            
            onDblClick: function (e) {
                openTab ('/tasks/' + this.get (e.recid) ['task'] ['uuid'])
            }
            
        }).refresh ();
        
        $('#grid_task_notesGrid_search_all').focus ()

    }

})