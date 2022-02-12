////////////////////////////////////////////////////////////////////////////////

$_DO.update_task_comment = async function () {

	let data = $('div.dx-popup.dx-widget').dxPopup ('instance').content ().dxForm ('instance').option ('formData')

	data.body = href2a (data.body)

    if (data.id_user_to == '...' || data.id_user_to == 'other') data.id_user_to = null

    var action = data.is_assigning ? 'assign': 'comment'
    
    data.uuid = new_uuid ()

    if (action == 'assign') {

        if (!data.id_user_to) die ('id_user_to', 'Вы забыли указать адресата')

        if (!confirm ('Адресат - ' + data.users.find (i => i.uuid === data.id_user_to).label + ', так?')) die ('id_user_to', 'Хорошо, давайте уточним')

    }
    else {
    
        if (data.id_user_to && !data.label) die ('label', 'Напишите что-нибудь, пожалуйста')
        
    }        

    data.txt = (data.label + ' ' + $('.dx-htmleditor-content') [0].innerText).replace (/\s+/gsm, ' ').trim ()

    $('body').block ()

    await response ({action}, {data})
    
    try {opener.tasks_grid.reload ()} catch (e) {}
    
    let to = data.id_user_to

    setTimeout (

        to == $_USER.id ? reload_page : 

        () => confirm ('Задача ' + (to == '0' ? 'завершена' : 'передана') + '. Закрыть эту страницу?') ? window.close () : reload_page ()

    , 10)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.task_comment = async function (o) {

    var data = clone ($('body').data ('data'))
    
    data.record = o

    if (o.is_assigning) {
    
        data.users = [
			...clone ($_USER.peers),
  //      	{id: 'other', label: '...кто-то ещё'},
        ]        

    	if (!data.record.id_user_to) {
    	
    		data.record.id_user_to = '...'
    		
    		data.users.unshift ({id: '...', label: '[укажите, пожалуйста, адресата]'})
    	
    	}
        	
        add_vocabularies (data, {users: 1})
                        
        return data
    
    }

    if (o.close) {
    
        data.record.id_user_to = '0'
    
    }
    else if (o.id_user_to) {
        
        data.record.id_user_to = o.id_user_to
        
    }
    else {

        data.record.id_user_to = data.executor.id

        if (data.record.id_user_to == $_USER.uuid) data.record.id_user_to = data.author.id

    }

    return data

}