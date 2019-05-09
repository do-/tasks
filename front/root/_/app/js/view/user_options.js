$_DRAW.user_options = async function (data) {
    
    let $result = $("#user_options")

    $result.draw_table ({

        columns: [
            {field: 'label', name: 'Опция',  width: 10},
            {field: 'user_options.is_on', name: 'Статус', width: 10, voc: {0: 'Нет', 1: 'Да'}},
        ],
                
        url: {type: 'users', part: 'options', id: data.uuid},

        onDblClick: $_DO.toggle_user_options

    })
    
    return $result

}