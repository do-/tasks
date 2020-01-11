$_DRAW.user = async function (data) {

    $('title').text (data.label)

    let $view = await draw_form ('user', data)
    
    $('main').html ($view)
    
    show_block ('user_options')

    return $view

}