define ([], function () {

    return function (data, view) {

        fill (view, {}, $('#img'))

        $('textarea').on ('paste', $_DO.paste_img)
        
        $('#png').click ($_DO.click_img)
        
        $('input[name=file]').change ($_DO.open_img)

    }

})