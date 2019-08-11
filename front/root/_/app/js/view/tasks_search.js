$_DRAW.tasks_search = async function (data) {

    let $view = (await to_fill ('tasks_search', data)).dialog ({width: 635,
        modal: true,
        buttons: [{name: 'update', text: 'Ctrl-Enter', attr: {"data-hotkey": "Ctrl-Enter"}}],
        close:   function () {$(this).dialog ("destroy")},
    }).dialog ("widget")

    return $view

}