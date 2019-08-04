$_DRAW.tasks = async function (data) {

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
            {field: 'label',             name: 'Тема',              width: 150},
            {field: 'id_user_author',    name: 'Автор',             width: 20, hidden: true, formatter: _io (data.users, 'я')},
            {field: 'id_user_executor',  name: 'Адресат',           width: 20, hidden: true, formatter: _io (data.users, 'мне')},
            {field: 'is_open',           name: 'Статус',            minWidth: 104, maxWidth: 104, hidden: true, voc: data.voc_status},
            {field: 'id_user',           name: 'На ком',            width: 20, formatter: _io (data.users, 'на мне')},
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
        
        onHeaderRowCellRendered: (e, a) => {
        
            let $anode = $(a.node)            

            function checkboxes (name) {
                
                let $os = $(`#${name}`, $result)                
                let $ns = $os.clone ()
                
                $os.remove ()        
                
                function label (ids) {
                    if (!ids || !ids.length) return '...'
                    return ids.map (id => $(`input[name=${id}]`, $ns).closest ('tr').text ())
                }                 

                let ids = null
                let loader = a.grid.loader
                if (loader && loader.postData && loader.postData.search) {
                    for (let search of loader.postData.search) if (search.field == name) ids = search.value
                }
                
                $(`input`, $ns).prop ({checked: false})
                if (ids) for (let id of ids) $(`input[name=${id}]`, $ns).prop ({checked: true})

                $anode.text (label (ids)).click (() => {
                
                    $ns.dialog ({

                        modal:   true,
                        close:   function () {$(this).dialog ("destroy")},
                        buttons: [{text: 'Установить', click: function () {

                            let ids = []

                            $('input:checked', $(this)).each (function () {
                                ids.push (this.name)
                            })

                            if (!ids.length) ids = null

                            $anode.text (label (ids))
                            
                            a.grid.setFieldFilter ({field: name, value: ids, operator: 'in'})

                            $(this).dialog ("destroy")

                        }}],

                    }).dialog ("widget")

                })  

            }
            
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

            }            
            
            switch (a.column.id) {
                case 'id_user_author':   return checkboxes ('id_user_author')
                case 'id_user_executor': return checkboxes ('id_user_executor')
                case 'id_user':          return checkboxes ('id_user')
                case 'is_open':          return select ('is_open')
                case 'label':            return a.grid.colFilter.text (a, {title: 'Фильтр по теме'})
                default: $anode.text ('\xa0')
            }
            
        },

    })

    return $result
    
}