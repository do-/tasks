$_DRAW.main = async function (data) {

    let $main = $('body').html ('<main/>')

    use.block ($_REQUEST.id ? en_unplural ($_REQUEST.type) : $_REQUEST.type)

    show_block ('nav')
    
    return $main

}