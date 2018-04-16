define ([], function () {

    $_DO.update_task_comment = function (e) {
    
        var f = w2ui ['task_comment_form']

        var v = f.values ()
        
        if (!v.label)   die ('label', 'Напишите что-нибудь')
        
        f.lock ()

        query ({action: 'comment'}, {data: v}, reload_page)
    
    }

    return function (done) {
                    
        done ($('body').data ('data'))
            
    }
    
})