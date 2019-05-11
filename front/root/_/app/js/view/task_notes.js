$_DRAW.task_notes = async function (data) {

    $('title').text ('Всеобщая переписка')

    let $result = $('main').html (fill (await use.jq ('task_notes'), data))
    
    let grid = $("#grid_task_notes").draw_table ({

        columns: [
            {field: 'ts',           name: 'Дата',      width: 20, formatter: (r, _, v) => v.slice (0, 19).replace ('T', ' ')},
            {field: 'label',        name: 'Заголовок', width: 100},
            {field: 'id_user_from', name: 'Автор',     width: 30, voc: data.users},
            {field: 'id_user_to',   name: 'Адресат',   width: 30, voc: data.users},
        ],
        
        searchInputs: 
            darn ($(".toolbar :input").toArray ())
        ,
        
        url: {type: 'task_notes'},

        onDblClick: (e, a) => open_tab ('/tasks/' + a.grid.getDataItem (a.row).id_task)

    })
    
    $(".toolbar input:first").focus ()

    return $result
    
    
/*    

    $('main').w2regrid ({ 
    
        name: 'task_notesGrid',             
        
        show: {
            toolbar: true,
            footer: true,
        },

        searches: [
            {field: 'note',    caption: 'Содержимое', type: 'text'},
            {field: 'id_user_from', caption: 'Автор', type: 'enum', options: {items: data.users.items}},
            {field: 'id_user_to', caption: 'Адресат', type: 'enum', options: {items: data.users.items}},
            {field: 'ts',    caption: 'Дата', type: 'date'},
            {field: 'status',  caption: 'Текущий статус',    type: 'list', options: {items: [{id: 1, text: 'В работе'}, {id: -1, text: 'Закрыто'}]}},
        ],

        columns: [

            {field: 'ts',                caption: 'Дата',      size: 20, render: _ts},
            {field: 'label',             caption: 'Заголовок',      size: 100},
            {field: 'id_user_from', caption: 'Автор',          size: 30, render: function (i) {return data.users [i.id_user_from]}},
            {field: 'id_user_to', caption: 'Адресат',          size: 30, render: function (i) {return data.users [i.id_user_to]}},

        ],
                    
        url: '_back/?type=task_notes',
        
        onDblClick: function (e) {
            openTab ('/tasks/' + this.get (e.recid) ['id_task'])
        }
        
    }).refresh ();
    
    $('#grid_task_notesGrid_search_all').focus ()
    
*/    

}