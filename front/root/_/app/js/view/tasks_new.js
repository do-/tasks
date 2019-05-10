$_DRAW.tasks_new = async function (data) {

    let $view = (await use.jq ('tasks_new')).dialog ({width: 635,
        modal: true,
        buttons: [{name: 'update', text: 'Создать...'}]
    }).dialog ("widget")
        
    $('#img', $view).show_block ('img')
        
    return $view

}