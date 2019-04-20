define ([], function () {

    $_DO.cancel_user = function (e) {
        
        if (!confirm ('Отменить несохранённые правки?')) return
        
        query ({}, {}, function (data) {

            data.__read_only = true

            $_F5 (data)

        })
        
    }
    
    $_DO.delete_user = function (e) {
        
        if (!confirm ('Серьёзно?')) return
        
        query ({action: 'delete'}, {}, function (data) {

            refreshOpener ()
            
            window.close ()

        })
        
    }

    $_DO.pass_user = function (e) {

        show_block ('user_password')

    }
    
    $_DO.edit_user = function (e) {

        var data = w2ui ['form'].record

        data.__read_only = false
                
        $_F5 (data)

    }

    $_DO.update_user = function (e) {
    
        if (!confirm ('Сохранить изменения?')) return
        
        var d = w2ui ['form'].values ()
         
        w2ui ['form'].lock ();
    
        query ({action: 'update'}, {data: d}, function (data) {
                  
           location.reload ()
       
        })
        
    }

    $_DO.choose_tab_user = function (e) {

        localStorage.setItem ('user.active_tab', e.tab.id)

        show_block (e.tab.id)

    }

    return function (done) {
    
        query ({}, {}, function (data) {
        
            data.active_tab = localStorage.getItem ('user.active_tab') || 'user_options'
            
            data.__read_only = true
            
            done (data)

        })
        
    }
    
})