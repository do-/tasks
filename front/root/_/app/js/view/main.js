$_DRAW.main = async function (data) {

    let $main = $('body').html ('<main/>')
    
    let type = $_REQUEST.id ? en_unplural ($_REQUEST.type) : $_REQUEST.type
    
    switch (type) {
        case 'user':
            use.block (type)
            break
        default: 
            show_block (type)
    }

    show_block ('nav')
    
    return $main

}