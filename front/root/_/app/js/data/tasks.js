define ([], function () {

    return function (done) {

        query ({part: 'vocs'}, {}, function (data) {
        
            add_vocabularies (data, {users: 1})

            $('body').data ('data', data)
                        
            done (data)
        
        })
        
    }
    
})