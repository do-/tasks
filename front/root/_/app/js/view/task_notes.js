$_DRAW.task_notes = async function (data) {

    $('title').text ('Переписка')

    let $result = $('main').html (await to_fill ('task_notes', data))
    
    let grid = $("#grid_task_notes").draw_table ({

        columns: [
            {field: 'ts',           name: 'Дата',      minWidth: 100, maxWidth: 100, formatter: _ts},
            {field: 'label',        name: 'Заголовок сообщения', width: 100},
            {field: 'id_user_from', name: 'Автор',     width: 30, voc: data.users},
            {field: 'id_user_to',   name: 'Адресат',   width: 30, voc: data.users},
            {field: 'tasks.label',  name: 'Тема задачи', width: 100},
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