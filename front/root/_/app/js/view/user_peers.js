$_DRAW.user_peers = async function (data) {

    let $view = await draw_popup ('user_peers', data, {height: 400})
    
    $("#grid_available", $view).draw_table ({

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
        	a.grid.setSelectedRows ([a.row])
        	$_DO.move_user_peers ('#grid_available', '#grid_selected')
        }

    })
    
    $("#grid_selected", $view).draw_table ({

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
        	a.grid.setSelectedRows ([a.row])
        	$_DO.move_user_peers ('#grid_selected', '#grid_available')
        }        

    })

//    for (i of data.users) if (i ['user_user.id_user']) $(`input[name=${i.uuid}]`, $view).prop ({checked: 1})

    return $view

}