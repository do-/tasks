$_DRAW.login = async function (data) {

    let $body = $('body').html (await use.html ('login')).css ({backgroundImage: 'url(' + staticURL ('libs/tasks/img/bg.jpg') + ')'})
    
    $('input[name=login]').focus ().keypress    (function (e) {if (e.which == 13) $('input[name=password]').focus ()})
    $('input[name=password]').keypress (function (e) {if (e.which == 13) $_DO.execute_login ()})
    
    return $body

}