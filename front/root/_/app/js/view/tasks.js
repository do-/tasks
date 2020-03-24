$_DRAW.tasks = async function (data) {
    
    function me_too (label) {
        let a = clone (data.others)
        a.unshift ({id: $_USER.id, label: label})
        return a
    }

    $('title').text ('Дела')
    
    let $result = $('main').html (await to_fill ('tasks', data))
        
    function _io (users, me) {
        return function (r, _, v) {
            if (v == $_USER.id) return me
            let fi = users [v]
            if (!fi) return '[закрыто]'
            let [f, i] = fi.split (' ')
            return i + ' ' + f.charAt (0) + '.'
        }
    }

    let grid = window.tasks_grid = $("#grid_tasks").draw_table ({

        columns: [
            {field: 'ts',                name: 'Дата',              width: 125, resizable: false, sortable: true, __cssClass: (r, c, d) => !d ? '' : 'status status-' + d.id_status, formatter: (r, c, v, o, d) => ({text: _ts (r, c, v), addClasses: 'status status-' + d.id_status}), filter: {type: 'dates', dt_from: 'YYYY-MM-01', dt_to: 'YYYY-MM-DD'}},

            {field: 'id_voc_project',    name: 'Проект',            width: 50, voc: data.voc_projects, filter: {type: 'checkboxes'}},
            {field: 'label',             name: 'Тема',              width: 150, cssClass: 'clickable', filter: {type: 'text', title: 'Фильтр по теме'}},

            {field: 'id_user_author',    name: 'Автор',             width: 20, hidden: true, formatter: _io (data.users, 'я'), filter: {type: 'checkboxes', title: 'Автор', items: me_too ('[я]')}},
            {field: 'id_user_executor',  name: 'Адресат',           width: 20, hidden: true, formatter: _io (data.users, 'мне'), filter: {type: 'checkboxes', title: 'Адресат', items: me_too ('[мне]')}},
            {field: 'id_status',         name: 'Статус',            width: 104, resizable: false, hidden: true, voc: data.voc_task_status, filter: {type: 'checkboxes', items: data.voc_task_status.items, empty: '[не важно]'}},
            {field: 'id_user',           name: 'На ком',            width: 20, formatter: _io (data.users, 'на мне'), filter: {type: 'checkboxes', title: 'На ком', items: me_too ('[на мне]')}},
            {field: 'task_note_label',   name: 'Последняя реплика', width: 50},
            {field: 'task_note_ts',      name: 'от',                width: 100, resizable: false, formatter: _ts, sortable: true},
        ],

        searchInputs: 
            darn ($(".toolbar :input").toArray ())
        ,
                        
        src: data.src,

        onRecordDblClick: (r) => open_tab ('/tasks/' + r.uuid),
        
        onClick: (e, a) => {
        	if (a.cell == 2) open_tab ('/tasks/' + a.grid.getDataItem (a.row).uuid)
        },

        onKeyDown: (e, a) => {
            if (e.which != 13 || e.ctrlKey || e.altKey) return
            a.grid.onDblClick.notify (a, e, this)
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