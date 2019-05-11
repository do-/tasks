$_DRAW.tasks = async function (data) {

    $('title').text ('Дела')
    
    let $result = $('main').html (fill (await use.jq ('tasks'), data))
    
    let grid = $("#grid_tasks").draw_table ({

        columns: [
            {field: 'ts',                name: 'Дата',      width: 40, formatter: (r, _, v) => v.slice (0, 19).replace ('T', ' ')},
            {field: 'label',             name: 'Тема',      width: 100},
            {field: 'id_user',           name: 'На ком сейчас',    width: 40, hidden: true, formatter: (r, _, v) => data.users [v] || '[закрыто]'},

            {field: 'task_notes.ts',           name: 'Дата',    width: 40, formatter: (r, _, v) => v.slice (0, 19).replace ('T', ' ')},
            {field: 'task_notes.label',        name: 'Текст',   width: 100},
            {field: 'task_notes.id_user_from', name: 'Автор',   width: 30, voc: data.users},
            {field: '_',           name: ' ',    width: 1, formatter: () => '&rarr;'},
            {field: 'task_notes.id_user_to',   name: 'Адресат', width: 30, voc: data.users},

        ],
        
        searchInputs: 
            darn ($(".toolbar :input").toArray ())
        ,
        
        url: {type: 'tasks'},

        onDblClick: (e, a) => open_tab ('/tasks/' + a.grid.getDataItem (a.row).uuid)

    })
    
    $(".toolbar input:first").focus ()

    return $result
    
    
/*
    $('main').w2regrid ({ 
    
        name: 'tasksGrid',             
        
        show: {
            toolbar: true,
            footer: true,
            toolbarAdd: true,
        },
        
        toolbar: {
            items: [
                {type: 'button', id: 'b1', caption: 'Что ожидается от меня', onClick: $_DO.show_required_tasks},
                {type: 'button', id: 'b2', caption: 'Чего я ожидаю', onClick: $_DO.show_created_tasks},
            ],
        },
        
        columnGroups : [
            {span: 4, caption: 'Дело'},
            {span: 5, caption: 'Последнее сообщение'},
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
            {field: 'ts',                caption: 'Дата',      size: 40, render: _ts},
            {field: 'label',             caption: 'Тема',      size: 100},
            {field: 'id_user',           caption: 'На ком сейчас',    size: 40, hidden: true, render: function (i) {return !i.id_user ? '' : data.users [i.id_user]}},

            {field: 'task_notes.ts',           caption: 'Дата',    size: 40, render: _ts},
            {field: 'task_notes.label',        caption: 'Текст',   size: 100},
            {field: 'task_notes.id_user_from', caption: 'Автор',   size: 30, voc: data.users},
            {field: '_',                       caption: ' ',       size: 5, render: function () {return '&rarr;'}},
            {field: 'task_notes.id_user_to',   caption: 'Адресат', size: 30, voc: data.users},

        ],
                    
        url: '_back/?type=tasks',

        onAdd: function (e) {show_block ('tasks_new')},
        
        onRender: $_DO.show_required_tasks,

    }).refresh ();
    
    $('#grid_tasksGrid_search_all').focus ()
*/
}