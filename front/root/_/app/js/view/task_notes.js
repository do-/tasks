$_DRAW.task_notes = async function (data) {

    $('title').text ('Переписка')

    let $result = $('main').html (await to_fill ('task_notes', data))
    
    let grid = $("#grid_task_notes").draw_table ({

        columns: [
            {field: 'ts',           name: 'Дата',      minWidth: 100, maxWidth: 100, formatter: _ts},
            {field: 'label',        name: 'Заголовок сообщения', cssClass: 'clickable', width: 100, filter: {type: 'text', title: '[Поиск]'}},
            {field: 'id_user_from', name: 'Автор',     width: 30, voc: data.users, filter: {type: 'checkboxes'}},
            {field: 'id_user_to',   name: 'Адресат',   width: 30, voc: data.users, filter: {type: 'checkboxes'}},
            {field: 'tasks.label',  name: 'Тема задачи', width: 100, filter: {type: 'text', title: '[Поиск]'}},
        ],
        
        searchInputs: 
            darn ($(".toolbar :input").toArray ())
        ,
        
        src: data.src,

        onRecordDblClick: (r) => open_tab ('/tasks/' + r.id_task),

        onClick: (e, a) => {
        	if (a.cell == 1) open_tab ('/tasks/' + a.grid.getDataItem (a.row) ['tasks.uuid'])
        },

    })
    
    $(".toolbar input:first").focus ()

    return $result
    
}