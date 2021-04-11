$_DRAW.user_aliens = async function (data) {

    let $view = await draw_popup ('user_aliens', data, {height: 400})
    
    let grid = $("#grid_available", $view).draw_table ({

//        enableCellNavigation: false,

        columns: [
            {	
            	field: "label", 
            	name: "Доступные",
				filter: {type: 'text', title: '[ФИО]'},
			},
        ],
        
        data: data.u [0],

        onRecordDblClick: r => {
        
        	$view.dialog ("close")
        	
        	data.set (r)
        	
        },

    })
    
	grid.onKeyDown.subscribe (function (e, args) {
		if (e.which == 13 && !e.ctrlKey && !e.altKey && grid.getActiveCell ()) grid.onDblClick.notify (args, e, this)
	})

    return $view

}