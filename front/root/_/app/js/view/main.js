
define ([], function () {

    return function () {           

        $('body').html ('<main/>')

        use.block ($_REQUEST.id ? en_unplural ($_REQUEST.type) : $_REQUEST.type)

        use.block ('nav')        

    }

})