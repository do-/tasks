$_DRAW.user_own_options = async function (data) {

	let $view = await draw_popup ('user_own_options', data)

    $("#the_table_container").draw_table ({

        columns: [
            {field: 'label', name: 'Опция',  width: 10},
            {field: 'user_options.is_on', name: 'Статус', width: 10, voc: {0: 'Нет', 1: 'Да'}},
        ],
                
        url: {type: 'users', part: 'options', id: $_USER.uuid},

        onDblClick: $_DO.toggle_user_own_options

    })
        
    return $view

}