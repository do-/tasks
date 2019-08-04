$_DRAW.tasks = async function (data) {

    $('title').text ('Дела')
    
    let $result = $('main').html (fill (await use.jq ('tasks'), data))
    
    $('option[data-me]').attr ({value: $_USER.id})
        
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
            {field: 'label',             name: 'Тема',              width: 150},
            {field: 'id_user_author',    name: 'Автор',             width: 20, hidden: true, formatter: _io (data.users, 'я')},
            {field: 'id_user_executor',  name: 'Адресат',           width: 20, hidden: true, formatter: _io (data.users, 'мне')},
            {field: 'id_user',           name: 'На ком',            width: 20, hidden: true, formatter: _io (data.users, 'на мне')},
            {field: 'task_notes.label',  name: 'Последняя реплика', width: 50},
            {field: 'task_notes.ts',     name: 'от',                minWidth: 100, maxWidth: 100, formatter: _ts, sortable: true},
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
        
        onHeaderRowCellRendered: (e, a) => {
        
            let $anode = $(a.node)

            function select (name) {
                let $os = $(`select[name=${name}]`, $result)
                let $ns = $os.clone ()
                $os.remove ()
                $ns.val (data [name])
                $ns.appendTo ($anode)
                $ns.selectmenu ({
                    width: true,
                    change: () => {a.grid.setFieldFilter (a.grid.toSearch ($ns))}
                })
                a.grid.loader.setSearch (a.grid.toSearch ($ns))
            }
            
            function input (name) {
                let $ns = $(`<input name=${name} class=ui-widget style="width:100%;margin:1px;border:0;outline:none;padding:0 0 0 3px;" placeholder="[Фильтр по теме...]">`)
                $ns.appendTo ($anode)
                $ns.change (() => {a.grid.setFieldFilter (a.grid.toSearch ($ns))})
            }
            
            switch (a.column.id) {
                case 'id_user_author':   return select ('id_user_author')
                case 'id_user_executor': return select ('id_user_executor')
                case 'id_user':          return select ('id_user')
                case 'label':            return input  ('label')
                default: $anode.text ('\xa0')
            }
            
        },

    })
        
//    $(".toolbar input:first").focus ()

    return $result
    
}