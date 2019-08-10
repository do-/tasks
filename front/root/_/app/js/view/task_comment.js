$_DRAW.task_comment = async function (data) {

    let it = data.record
    
    it.users = ((users) => {
    
        if (it.is_assigning) return users
        
        if ($_USER.id == data.author.id) users.push ({id: "0", text: 'Никто. Дело окончно.'})
        
        for (let i of users) if (i.id == $_USER.id) i.text = 'Я, ' + i.text
        
        return users
        
    }) (clone (data.users.items));

    let $view = (await to_fill ('task_comment', it)).dialog ({width: 635,
        modal:   true,
        buttons: [{name: 'update', text: 'Ctrl-Enter', attr: {"data-hotkey": "Ctrl-Enter"}}],
        close:   function () {$(this).dialog ("destroy")},
    }).dialog ("widget")

    $('select', $view).selectmenu ({width: true})
    
    $('#img', $view).show_block ('img')

    $('textarea', $view).focus ()    

    return $view

}