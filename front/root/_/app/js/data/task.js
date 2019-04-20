define ([], function () {
    
    $_DO.comment_task = function () {
    
        show_block ('task_comment')
    
    }

    $_DO.close_task = function () {

        show_block ('task_comment', {close: 1})

    }
    
    $_DO.assign_task = function (e) {
    
        let o = {is_assigning: 1}

        let $b = $(e.target); if ($b.hasClass ('peer')) o.id_user_to = $b.data ('data').uuid

        show_block ('task_comment', o)

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