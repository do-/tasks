////////////////////////////////////////////////////////////////////////////////

$_DO.click_task_footer = function (e) {

    show_block ('task_comment', $(e.target).data ('data'))

}

////////////////////////////////////////////////////////////////////////////////

$_GET.task_footer = async function (o) {
            
    let data = clone ($('body').data ('data'))

    if (!data.id_user || !data.users [$_USER.id]) return data
    
    data.buttons = [{
        id:    "comment",
        title: "Добавить комментарий",
        data:  {},
    }]

    if (data.author.id == $_USER.id) data.buttons.unshift ({
        id:    "close",
        title: "Зафиксировать окончание",
        data:  {close: 1},
    })

    if (data.author.id != data.executor.id) return data

    data.buttons.push ({
        id:    "assign",
        title: "Запустить",
        data:  {is_assigning: 1},
    })

    for (i of data.peers) data.buttons.push ({
        title: i.label,
        data: {
            is_assigning: 1, 
            id_user_to: i.uuid,
        },
    })

    return data

}