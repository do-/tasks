$_DRAW.user_peers = async function (data) {

    let $view = await draw_popup ('user_peers', data, {height: 400})
    
    let grid_available, grid_selected
    
    grid_available = $("#grid_available", $view).draw_table ({

        enableCellNavigation: false,

        columns: [
			{
				hideInColumnTitleRow: true,
				class: Slick.CheckboxSelectColumn,
			},
            {	
            	field: "label", 
            	name: "Доступные",
            },
        ],
        
        data: data.u [0],
        
        onDblClick: (e, a) => {
			grid_available.moveDataTo (grid_selected, {rows: [a.row]})
        }

    })
    
    grid_selected = $("#grid_selected", $view).draw_table ({

        enableCellNavigation: false,

        columns: [
			{
				hideInColumnTitleRow: true,
				class: Slick.CheckboxSelectColumn,
			},
            {	
            	field: "label", 
            	name: "Выбранные",
            },
        ],
        
        data: data.u [1],
        
        onDblClick: (e, a) => {
			grid_selected.moveDataTo (grid_available, {rows: [a.row]})
        }        

    })

    return $view

}