define ([], function () {

    $_DO.comment_task = function () {
    
        use.block ('task_comment')
    
    }

    return function (done) {
    
        query ({}, {}, function (data) {
        
            add_vocabularies (data, {users: 1})
                    
            done (data)

        })
        
    }
    
})