$_DRAW.tasks_new = async function (data) {

    let $view = (await use.jq ('tasks_new')).dialog ({width: 635,
        modal: true,
        buttons: [{name: 'update', text: 'Ctrl-Enter'}]
    }).dialog ("widget")
        
    $('#img', $view).show_block ('img')
        
    $(window).keyup ((e) => {if (e.which == 13 && e.ctrlKey) $('button[name=update]').click ()})

    return $view

}