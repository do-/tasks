$_DRAW.user = async function (data) {

    $('title').text (data.label)
    
    let $main = $('main').html ((await use.jq ('user')).draw_form (data))
    
    show_block ('user_options')

    return $main

}