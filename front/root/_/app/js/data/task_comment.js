define ([], function () {

    $_DO.paste_tasks_comment = function (e) {
    
        var item = e.clipboardData.items

        var png
        
        for (i in item) if (item [i].type == 'image/png') png = item [i]
        
        if (!png) return
        
        var reader = new FileReader ()
            
        reader.onload = function () {
            var url = reader.result
            $('#png').css ('content', 'url(' + url + ')')
            $('input[name=img]').val (url.split (',') [1])
            alert ('Изображение скопировано')
        }
            
        reader.readAsDataURL (png.getAsFile ())

    }

    $_DO.update_task_comment = function (e) {
    
        var f = w2ui ['task_comment_form']

        var v = f.values ()
        
        v.img = $('input[name=img]').val ()
        
        if (!v.label)   die ('label', 'Напишите что-нибудь')
        
        f.lock ()

        query ({action: 'comment'}, {data: v}, reload_page)
    
    }

    return function (done) {
                    
        done ($('body').data ('data'))
            
    }
    
})