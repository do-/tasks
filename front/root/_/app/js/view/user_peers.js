$_DRAW.user_peers = async function (data) {

    let $view = await draw_popup ('user_peers', data)

    for (i of data.users) if (i ['user_user.is_on']) $(`input[name=${i.uuid}]`, $view).prop ({checked: 1})

    return $view

}