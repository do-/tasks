define ([], function () {

    $_DO.update_user_peers = function (e) {
                    
        query ({type: 'users', action: 'set_peers'}, {data: {ids: w2ui ['user_peers_grid'].getSelection ()}}, function () {w2popup.close (); alert ('OK')})

    }

    return function (done) {
    
        query ({type: 'users', id: undefined, part: 'peers'}, {search: [{field: "id", operator: "not in", value: [{id: $_USER.id}]}], searchLogic: 'AND', limit: 100, offset: 0}, function (data) {

            done ({users: dia2w2uiRecords (data.users)})

        })

    }

})