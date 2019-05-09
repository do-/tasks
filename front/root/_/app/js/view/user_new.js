$_DRAW.user_new = async function (data) {

    let $view = fill (await use.jq ('user_new'), data).dialog ({
        modal: true,
        buttons: [{
            name: 'update',
            text: 'Создать...',
        }]
    }).dialog ("widget")
    
    $('input[type=radio]:last', $view).prop ({checked: 1})
    
    return $view
    
}