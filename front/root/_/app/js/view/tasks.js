$_DRAW.tasks = async function (data) {
    
    function me_too (label) {
        let a = clone (data.others)
        a.unshift ({id: $_USER.id, label: label})
        return a
    }

    $('title').text ('Дела')
    
    let $result = $('main').html (fill (await use.jq ('tasks'), data))
    
    $('option[data-me]').attr ({value: $_USER.id})
    $('input[data-me]').attr ({name: $_USER.id})
        
    function _io (users, me) {
        return function (r, _, v) {
            if (v == $_USER.id) return me
            let fi = users [v]
            if (!fi) return '[закрыто]'
            return fi.split (' ') [1]
        }
    }

    let grid = window.tasks_grid = $("#grid_tasks").draw_table ({
    
        showHeaderRow: true,

        columns: [
            {field: 'ts',                name: 'Дата',              minWidth: 100, maxWidth: 100, formatter: _ts, sortable: true},
            {field: 'label',             name: 'Тема',              width: 150, filter: {type: 'text', title: 'Фильтр по теме'}},
            {field: 'id_user_author',    name: 'Автор',             width: 20, hidden: true, formatter: _io (data.users, 'я'), filter: {type: 'checkboxes', title: 'Автор', items: me_too ('[я]')}},
            {field: 'id_user_executor',  name: 'Адресат',           width: 20, hidden: true, formatter: _io (data.users, 'мне'), filter: {type: 'checkboxes', title: 'Адресат', items: me_too ('[мне]')}},
            {field: 'is_open',           name: 'Статус',            minWidth: 104, maxWidth: 104, hidden: true, voc: data.voc_status, filter: {type: 'list', voc: data.voc_status, empty: '[не важно]'}},
            {field: 'id_user',           name: 'На ком',            width: 20, formatter: _io (data.users, 'на мне'), filter: {type: 'checkboxes', title: 'На ком', items: me_too ('[на мне]')}},
            {field: 'task_notes.label',  name: 'Последняя реплика', width: 50},
            {field: 'task_notes.ts',     name: 'от',                minWidth: 100, maxWidth: 100, formatter: _ts, sortable: true},
        ],

        searchInputs: 
            darn ($(".toolbar :input").toArray ())
        ,
                
        postData: {search: [
            {field: 'id_user_author',   value: data.id_user_author, operator: 'in'},
            {field: 'id_user_executor', value: data.id_user_executor, operator: 'in'},
            {field: 'id_user',          value: data.id_user, operator: 'in'},
            {field: 'is_open',          value: data.is_open, operator: 'is'},
        ].filter (i => i.value != null)},
        
        url: {type: 'tasks'},

        onDblClick: (e, a) => open_tab ('/tasks/' + a.grid.getDataItem (a.row).uuid),

        onKeyDown: (e, a) => {
            if (e.which != 13 || e.ctrlKey || e.altKey) return
            open_tab ('/tasks/' + a.grid.getDataItem (a.row).uuid)
        },        

    })

    return $result
    
}