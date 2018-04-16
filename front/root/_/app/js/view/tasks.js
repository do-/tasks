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
            
            toolbar: {
                items: [
                    {type: 'button', id: 'b1', caption: 'Что у меня в работе', onClick: $_DO.show_required_tasks},
                    {type: 'button', id: 'b2', caption: 'Что я просил', onClick: $_DO.show_created_tasks},
                ],
//                onClick: function (target, data) {
//                    console.log(target);
//                }
            },
            
            columnGroups : [
                {span: 4, caption: 'Дело'},
                {span: 3, caption: 'Последняя реплика'},
            ],
            
            searches: [
                {field: 'label',   caption: 'Тема',      type: 'text'},
                {field: 'note',    caption: 'Переписка', type: 'text'},
                {field: 'id_user', caption: 'Кто занимается сейчас',    type: 'enum', options: {items: data.users.items}},
                {field: 'status',  caption: 'Статус',    type: 'list', options: {items: [{id: 1, text: 'В работе'}, {id: -1, text: 'Закрыто'}]}},
                {field: 'id_other_user', caption: 'Участник(и)...',  type: 'enum', options: {items: data.users.items}},
                {field: 'is_author',  caption: '...в роли',    type: 'list', options: {items: [{id: 1, text: 'Автор'}, {id: -1, text: 'Адресат'}]}},
            ],

            columns: [

                {field: 'uuid',              caption: 'ID',        size: 87, hidden: true},
                {field: 'ts',                caption: 'Дата',      size: 40, render: function (i) {return i.ts.substring (0,19)}},
                {field: 'label',             caption: 'Тема',      size: 100},
                {field: 'id_user',           caption: 'На ком сейчас',    size: 40, hidden: true, render: function (i) {return !i.id_user ? '' : data.users [i.id_user]}},

                {field: 'task_note.ts',      caption: 'Дата',      size: 40, render: function (i) {return i.task_note.ts.substring (0,19)}},
                {field: 'task_note.label',   caption: 'Заголовок', size: 100},
                {field: 'task_note.id_user_from', caption: 'Автор',   size: 30, render: function (i) {return data.users [i.task_note.id_user_from]}},

            ],
                        
            url: '_back/?type=tasks',

            onAdd: function (e) {use.block ('tasks_new')},
            
            onRender: $_DO.show_required_tasks,

        }).refresh ();
        
        $('#grid_tasksGrid_search_all').focus ()

    }

})