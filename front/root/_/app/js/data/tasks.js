$_DO.show_required_tasks = function () {

    var grid = w2ui ['tasksGrid'] || this

    grid.search ([

        {field: "id_user", type: "enum", operator: "in", value: [{"id": $_USER.id, "text": $_USER.label}]}

    ], 'AND')
    
}    

$_DO.show_created_tasks = function () {

    var grid = w2ui ['tasksGrid']

    grid.search ([

        {field: "id_other_user", type: "enum", operator: "in", value: [{"id": $_USER.id, "text": $_USER.label}]},
        {field: "is_author", type: "list", operator: "is", value: 1, "text": "Автор"},
        {field: "status", type: "list", operator: "is", value: 1, "text": "В работе"}

    ], 'AND')
    
}

$_GET.tasks = async function (o) {

    let data = await response ({part: 'vocs'})

    add_vocabularies (data, {users: 1})

    return data

}
