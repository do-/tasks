$_DRAW.tasks_new = async function (data) {

    let $view = (fill (await use.jq ('tasks_new'), data)).dialog ({width: 635,
        modal: true,
        buttons: [{name: 'update', text: 'Ctrl-Enter', attr: {"data-hotkey": "Ctrl-Enter"}}],
        close:   function () {$(this).dialog ("destroy")},
    }).dialog ("widget")
        
    $('#img', $view).show_block ('img')

    return $view

}