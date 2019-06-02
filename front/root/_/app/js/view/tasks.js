$_DRAW.tasks = async function (data) {

    $('title').text ('Дела')
    
    let $result = $('main').html (fill (await use.jq ('tasks'), data))
    
    let __io = _io (data.users)
    
    let grid = $("#grid_tasks").draw_table ({

        columns: [
            {field: 'ts',                name: 'Дата',              minWidth: 125, maxWidth: 125, formatter: _ts},
            {field: 'label',             name: 'Тема',              width: 150},
            {field: 'author.id_user',    name: 'Автор',             width: 20, hidden: true, formatter: __io},
            {field: 'executor.id_user',  name: 'Адресат',           width: 20, hidden: true, formatter: __io},
            {field: 'id_user',           name: 'На ком',     width: 20, hidden: true, formatter: __io},
            {field: 'task_notes.label',  name: 'Последняя реплика', width: 50},
            {field: 'task_notes.ts',     name: 'от',                minWidth: 125, maxWidth: 125, formatter: _ts},
        ],

        searchInputs: 
            darn ($(".toolbar :input").toArray ())
        ,
        
        url: {type: 'tasks'},

        onDblClick: (e, a) => open_tab ('/tasks/' + a.grid.getDataItem (a.row).uuid),

        onKeyDown: (e, a) => {
            if (e.which != 13 || e.ctrlKey || e.altKey) return
            open_tab ('/tasks/' + a.grid.getDataItem (a.row).uuid)
        },

    })
    
    $(".toolbar input:first").focus ()

    return $result
    
}