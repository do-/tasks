////////////////////////////////////////////////////////////////////////////////

$_DO.update_task_comment = function (e) {

    var f = w2ui ['task_comment_form']
    
    var tia = {action: f.record.is_assigning ? 'assign': 'comment'}

    var v = f.values ()
    
    v.img = $('input[name=img]').val ()
    v.ext = $('input[name=ext]').val ()

    if (tia.action == 'assign') {

        if (!v.id_user_to) die ('id_user_to', 'Вы забыли указать адресата')
        
        if (!confirm ('Адресат - ' + f.record.id_user_to.label + ', так?')) die ('id_user_to', 'Хорошо, давайте уточним')

    }
    else {
    
        if (v.id_user_to && !v.label) die ('label', 'Напишите что-нибудь')
        
    }        

    f.lock ()

    query (tia, {data: v}, reload_page)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.task_comment = async function (o) {

    var data = clone ($('body').data ('data'))
    
    data.record = o

    if (o.is_assigning) {
    
        let d = await response ({type: 'users', id: undefined}, {search: [{field: "uuid", operator: "not in", value: [{id: $_USER.uuid}]}], searchLogic: 'AND', limit: 100, offset: 0})

        data.users = d.users.map (function (i) {return {id: i.uuid, label: i.label}})
            
        add_vocabularies (data, {users: 1})
                        
        return data
    
    }

    if (o.close) {
    
        data.record.id_user_to = 0
    
    }
    else {

        data.record.id_user_to = data.executor.id

        if (data.record.id_user_to == $_USER.uuid) data.record.id_user_to = data.author.id

    }

    return data

}