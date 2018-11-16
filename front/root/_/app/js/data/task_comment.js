define ([], function () {

    $_DO.update_task_comment = function (e) {
    
        var f = w2ui ['task_comment_form']
        
        var tia = {action: f.record.is_assigning ? 'assign': 'comment'}

        var v = f.values ()
        
        v.img = $('input[name=img]').val ()
        v.ext = $('input[name=ext]').val ()

        if (tia.action == 'assign') {

            if (!v.id_user_to) die ('id_user_to', 'Вы забыли указать адресата')
            
            if (!confirm ('Адресат - ' + f.record.id_user_to.label + ', так?')) die ('id_user_to', 'Хорошо, давайте уточним')

        }
        else {
        
            if (v.id_user_to && !v.label) die ('label', 'Напишите что-нибудь')
            
        }        

        f.lock ()

        query (tia, {data: v}, reload_page)
    
    }

    return function (done) {
    
        var data = clone ($('body').data ('data'))
        
        data.record = {
            is_assigning: $_SESSION.delete ('assign'),
            id_user_to:   $_SESSION.delete ('id_user_to'),
        }

        if (data.record.is_assigning) {
        
            query ({type: 'users', id: undefined}, {search: [{field: "id", operator: "not in", value: [{id: $_USER.id}]}], searchLogic: 'AND', limit: 100, offset: 0}, function (d) {
            
                add_vocabularies (d, {users: 1})
                
                data.users = d.users
            
                done (data)

            })
        
        }
        else {

            data.record.id_user_to = $_SESSION.delete ('close') ? "0" : parseInt (data.author.id) + parseInt (data.executor.id) - $_USER.id

            done (data)

        }

    }

})