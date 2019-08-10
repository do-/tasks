$_DRAW.user_new = async function (data) {

    let $view = (await to_fill ('user_new', data)).dialog ({
        modal: true,
        buttons: [{
            name: 'update',
            text: 'Создать...',
        }]
    }).dialog ("widget")
        
    return $view
    
}