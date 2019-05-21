$_DRAW.tasks = async function (data) {

    $('title').text ('Дела')
    
    let $result = $('main').html (fill (await use.jq ('tasks'), data))
    
    let grid = $("#grid_tasks").draw_table ({

        columns: [
            {field: 'ts',                name: 'Дата',      width: 40, formatter: (r, _, v) => v.slice (0, 19).replace ('T', ' ')},
            {field: 'label',             name: 'Тема',      width: 100},
            {field: 'id_user',           name: 'На ком сейчас',    width: 40, hidden: true, formatter: (r, _, v) => data.users [v] || '[закрыто]'},

            {field: 'task_notes.ts',           name: 'Дата',    width: 40, formatter: (r, _, v) => v.slice (0, 19).replace ('T', ' ')},
            {field: 'task_notes.label',        name: 'Последняя реплика',   width: 100},
            {field: 'task_notes.id_user_from', name: 'Автор',   width: 30, voc: data.users},
            {field: '_',           name: ' ',    width: 1, formatter: () => '&rarr;'},
            {field: 'task_notes.id_user_to',   name: 'Адресат', width: 30, voc: data.users},

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