define ([], function () {

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
            {field: "is_author", type: "list", operator: "is", value: 1, "text": "Автор"}

        ], 'AND')
        
    }

    return function (done) {

        query ({part: 'vocs'}, {}, function (data) {
        
            add_vocabularies (data, {users: 1})

            $('body').data ('data', data)
                        
            done (data)
        
        })
        
    }
    
})