define ([], function () {
    
    $_DO.comment_task = function () {
    
        use.block ('task_comment')
    
    }

    $_DO.close_task = function () {
    
        $_SESSION.set ('close', 1)
    
        use.block ('task_comment')
    
    }
    
    $_DO.assign_task = function (e) {

        var $b = $(e.target)

        if ($b.hasClass ('peer')) $_SESSION.set ('id_user_to', $b.data ('data').uuid)
    
        $_SESSION.set ('assign', 1)
    
        use.block ('task_comment')
    
    }
    
    function ucfirst (s) {
        return s.charAt (0).toUpperCase ()
    }

    return function (done) {

        query ({}, {}, function (data) {

            add_vocabularies (data, {users: 1})

            $.each (data.peers, function () {

                this.peer_id = 'peer_' + this.uuid

                var p = this.label.split (/\s+/)
                this.nick = p.length == 1 ? ucfirst (p [0]) : ucfirst (p [1]) + ucfirst (p [0])
                
            })

            done (data)

        })

    }

})