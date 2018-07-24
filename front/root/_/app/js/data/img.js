define ([], function () {

    function getFileInput () {
        return $('input[type=file]')
    }

    function loadImage (file) {

        if (!file) return

        var part = file.type.split ('/')

        if (part [0] != 'image') die ('file', 'Выбранный файл — не изображение')

        if (['gif', 'jpeg', 'png'].indexOf (part [1]) < 0) die ('file', 'Неизвестный формат изображения')

        var reader = new FileReader ()

        reader.onload = function () {
            var url = reader.result
            $('#png').css ('content', 'url(' + url + ')')
            $('input[name=img]').val (url.split (',') [1])
            alert ('Изображение скопировано')
        }

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