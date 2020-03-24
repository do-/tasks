$_DRAW.voc_projects = async function (data) {
    
    $('title').text ('Проекты')
    
    let $result = $('main').html (await use.html ('voc_projects'))

    let grid = $("#grid_voc_projects").draw_table ({

        columns: [
            {field: "label", name: "Наименование", width: 200},
        ],
        
        searchInputs: 
            $(".toolbar :input").toArray ()
        ,
        
        src: data.src,
        
//        onRecordDblClick: (r) => open_tab ('/voc_projects/' + r.uuid),

    })
    
    $(".toolbar input:first").focus ()

    return $result

}