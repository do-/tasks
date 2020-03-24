$_DRAW.task_comment = async function (data) {

    let it = data.record
    
    it.users = ((users) => {
    
        if (it.is_assigning) return users
        
        if ($_USER.id == data.author.id) users.push ({id: "0", text: 'Никто. Дело окончено.'})
        
        for (let i of users) if (i.id == $_USER.id) i.text = 'Я, ' + i.text
        
        return users
        
    }) (clone (data.users.items))

	let $view = await draw_popup ('task_comment', it)

    $('select', $view).selectmenu ({width: true})
    
    $('#img', $view).show_block ('img')

    $('textarea', $view).focus ()    

    return $view

}