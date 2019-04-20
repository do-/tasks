$_DRAW.main = async function (data) {

    let $main = $('body').html ('<main/>')
    
    let type = $_REQUEST.id ? en_unplural ($_REQUEST.type) : $_REQUEST.type
    
    switch (type) {
        case 'users':
            show_block (type)
            break
        default: 
            use.block (type)
    }

    show_block ('nav')
    
    return $main

}