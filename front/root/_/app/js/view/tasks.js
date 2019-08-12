$_DRAW.tasks = async function (data) {
    
    function me_too (label) {
        let a = clone (data.others)
        a.unshift ({id: $_USER.id, label: label})
        return a
    }

    $('title').text ('Дела')
    
    let $result = $('main').html (await to_fill ('tasks', data))

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
            {field: 'ts',                name: 'Дата',              width: 125, resizable: false, formatter: _ts, sortable: true, cssClass: (r, c, d) => !d ? '' : 'status status-' + d.id_status},
            {field: 'label',             name: 'Тема',              width: 150, filter: {type: 'text', title: 'Фильтр по теме'}},
            {field: 'id_user_author',    name: 'Автор',             width: 20, hidden: true, formatter: _io (data.users, 'я'), filter: {type: 'checkboxes', title: 'Автор', items: me_too ('[я]')}},
            {field: 'id_user_executor',  name: 'Адресат',           width: 20, hidden: true, formatter: _io (data.users, 'мне'), filter: {type: 'checkboxes', title: 'Адресат', items: me_too ('[мне]')}},
            {field: 'id_status',         name: 'Статус',            width: 104, resizable: false, hidden: true, voc: data.voc_task_status, filter: {type: 'checkboxes', items: data.voc_task_status.items, empty: '[не важно]'}},
            {field: 'id_user',           name: 'На ком',            width: 20, formatter: _io (data.users, 'на мне'), filter: {type: 'checkboxes', title: 'На ком', items: me_too ('[на мне]')}},
            {field: 'task_notes.label',  name: 'Последняя реплика', width: 50},
            {field: 'task_notes.ts',     name: 'от',                width: 100, resizable: false, formatter: _ts, sortable: true},
        ],

        searchInputs: 
            darn ($(".toolbar :input").toArray ())
        ,
                
        postData: {search: [
            {field: 'id_user_author',   value: data.id_user_author, operator: 'in'},
            {field: 'id_user_executor', value: data.id_user_executor, operator: 'in'},
            {field: 'id_user',          value: data.id_user, operator: 'in'},
            {field: 'id_status',        value: data.id_status, operator: 'in'},
        ].filter (i => i.value != null)},
        
        url: {type: 'tasks'},

        onDblClick: (e, a) => open_tab ('/tasks/' + a.grid.getDataItem (a.row).uuid),

        onKeyDown: (e, a) => {
            if (e.which != 13 || e.ctrlKey || e.altKey) return
            open_tab ('/tasks/' + a.grid.getDataItem (a.row).uuid)
        },        
        
        onContextMenu: (e, a) => {
            let grid = a.grid
            let rc = grid.getCellFromEvent (e)
            let col = grid.getColumns () [rc.cell]
            let filter = col.filter; 
            if (!filter || (filter.type != 'checkboxes' && filter.type != 'list')) return
            let [v] = grid.loader.postData.search.filter (i => i.field == col.field).map (i => i.value)
            if (v) return
            blockEvent (e)
            let $m = $('<ul>').css ({
                'position': 'absolute',
                'z-index' : 2,
            })
            let $div = $(e.target)
            let txt = $div.text ()
            $('<li>').text ('Только ' + txt).appendTo ($m)
            let [ln] = $div.attr ('class').split (/\s+/).filter (c => /^l\d+$/.test (c))
            $m.css ({left: e.clientX - 5, top: e.clientY - 5}).appendTo ($('body')).menu ()
            $m.on ("menublur", () => $m.remove ())
            $m.on ("click", () => {
                let ff = {field: col.field}
                let v = grid.getDataItem (rc.row)[col.field]
                let $hdr = $('div.slick-headerrow-column.' + ln)
                if (filter.type == 'checkboxes') {
                    ff.operator = 'in'
                    ff.value = [v]
                    $hdr.text ('[' + txt + ']')
                }
                else {
                    ff.operator = 'is'
                    ff.value = v
                    let $ns = $('select', $hdr)
                    $ns.val (v)
                    $ns.selectmenu ("refresh")
                }
                grid.setFieldFilter (ff)
            })
        },

    })

    return $result
    
}