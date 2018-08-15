define ([], function () {

    $_DO.update_task_comment = function (e) {
    
        var f = w2ui ['task_comment_form']

        var v = f.values ()
        
        v.img = $('input[name=img]').val ()
        
        if (v.id_user_to && !v.label) die ('label', 'Напишите что-нибудь')
        
        f.lock ()

        query ({action: 'comment'}, {data: v}, reload_page)
    
    }
    
    function get_user (data) {
    
        if ($_SESSION.delete ('close')) return null
        
        return parseInt (data.author.id) + parseInt (data.executor.id) - $_USER.id
        
    }

    return function (done) {
    
        var data = clone ($('body').data ('data'))
        
        data.record = {id_user_to: {id: get_user (data)}}
                            
        done (data)
            
    }
    
})