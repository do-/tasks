$_DRAW.user_new = async function (data) {
darn (data)
    let $view = fill (await use.jq ('user_new'), data).dialog ({
        modal: true,
        buttons: [{
            name: 'update',
            text: 'Создать...',
        }]
    }).dialog ("widget")
        
    return $view
    
}