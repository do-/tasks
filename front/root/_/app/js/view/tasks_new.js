$_DRAW.tasks_new = async function (data) {

    let $view = (fill (await use.jq ('tasks_new'), data)).dialog ({width: 635,
        modal: true,
        buttons: [{name: 'update', text: 'Создать'}],
        close:   function () {$(this).dialog ("destroy")},
    }).dialog ("widget")
        
    $('#img', $view).show_block ('img')
        
//    $(window).keyup ((e) => {if (e.which == 13 && e.ctrlKey) $('button[name=update]').click ()})

    return $view

}