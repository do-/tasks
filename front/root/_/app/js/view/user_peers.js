$_DRAW.user_peers = async function (data) {

    let $view = (await to_fill ('user_peers', data)).dialog ({
        modal: true,
        buttons: [{name: 'update', text: 'Установить'}]
    }).dialog ("widget")

    for (i of data.users) if (i ['user_user.is_on']) $(`input[name=${i.uuid}]`, $view).prop ({checked: 1})

    return $view

}