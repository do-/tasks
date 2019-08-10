$_DRAW.user_password = async function (data) {

    let $view = (await to_fill ('user_password', data)).dialog ({
        modal: true,
        buttons: [{
            name: 'update',
            text: 'Установить',
        }]
    }).dialog ("widget")

    return $view

}