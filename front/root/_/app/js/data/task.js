define ([], function () {

    return function (done) {

        query ({}, {}, function (data) {

            add_vocabularies (data, {users: 1})
            
            $('body').data ('data', data)

            done (data)

        })

    }

})