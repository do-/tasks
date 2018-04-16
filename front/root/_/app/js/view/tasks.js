define ([], function () {
    
    return function (data, view) {
    
        $('title').text ('Дела')

        $('main').w2regrid ({ 
        
            name: 'tasksGrid',             
            
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: true,
            },            

            columnGroups : [
                {span: 4, caption: 'Дело'},
                {span: 3, caption: 'Последняя реплика'},
            ],
            
            columns: [

                {field: 'uuid',              caption: 'ID',        size: 87, hidden: true},
                {field: 'ts',                caption: 'Дата',      size: 40, render: function (i) {return i.ts.substring (0,19)}},
                {field: 'label',             caption: 'Тема',      size: 100},
                {field: 'id_user',           caption: 'На ком сейчас',    size: 40, render: function (i) {return !i.id_user ? '' : data.users [i.id_user]}},

                {field: 'task_note.ts',      caption: 'Дата',      size: 40, render: function (i) {return i.task_note.ts.substring (0,19)}},
                {field: 'task_note.label',   caption: 'Заголовок', size: 100},
                {field: 'task_note.id_user_from', caption: 'Автор',   size: 30, render: function (i) {return data.users [i.task_note.id_user_from]}},

            ],
                        
            url: '_back/?type=tasks',

            onAdd: function (e) {use.block ('tasks_new')},

        }).refresh ();
        
        $('#grid_tasksGrid_search_all').focus ()

    }

})