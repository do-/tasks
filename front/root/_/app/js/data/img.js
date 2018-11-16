define ([], function () {

    function getFileInput () {
        return $('input[type=file]')
    }

    function img_handler (url) {    

        $('#png').show ()
        $('#mp4').hide ()

        Base64file.measure (url, function (dim) {
        
            var $png = $('#png')
                                
            $png.css ({
                height: $png.width () * dim.height / dim.width,
                content: 'url(' + url + ')'
            })
            
            $('input[name=img]').val (url.split (',') [1])

        })

    }
    
    function mp4_handler (url) {    
    
        $('#png').hide ()
        $('#mp4').show ()
    
        $('<source type="video/mp4">').attr ('src', url).appendTo ($('#mp4').empty ())        
            
        $('input[name=img]').val (url.split (',') [1])

    }

    function image_handler (type) {    
    
        $('input[name=ext]').val (type)
    
        switch (type) {        
            case 'gif':
            case 'jpeg':
            case 'png':
                return img_handler
            default: 
                die ('file', 'Этот формат изображений не поддерживается')            
        }    
        
    }
    
    function video_handler (type) {    

        $('input[name=ext]').val (type)
        
        switch (type) {        
            case 'mp4':
                return mp4_handler
            default: 
                die ('file', 'Этот формат видео не поддерживается')            
        }
        
    }

    function media_handler (part) {    
        switch (part [0]) {        
            case 'image': return image_handler (part [1])
            case 'video': return video_handler (part [1])            
            default: die ('file', 'Этот формат файлов не поддерживается')            
        }    
    }

    function loadImage (file) {

        if (!file) return
        
        var done = media_handler (file.type.split ('/'))
    
        var reader = new FileReader ()

        reader.onload = function () {done (reader.result)}

        reader.readAsDataURL (file)

    }           
    
    $_DO.open_img = function (e) {
        loadImage (getFileInput ().get (0).files [0])
    }
    
    $_DO.drop_img = function (e) {
        loadImage (blockEvent (e).originalEvent.dataTransfer.files [0])
    }
        
    $_DO.click_img = function (e) {
        getFileInput ().get (0).click ()
    }

    $_DO.paste_img = function (e) {

        var item = e.originalEvent.clipboardData.items

        for (i in item) if (item [i].type == 'image/png') return loadImage (item [i].getAsFile ())

    }

    return function (done) {
                    
        done ()
        
    }
    
})