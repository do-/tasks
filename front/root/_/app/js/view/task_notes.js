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
    
}