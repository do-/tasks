////////////////////////////////////////////////////////////////////////////////

$_DO.update_tasks_new = async function () {

	let $popup = $('div.dx-popup.dx-widget'), popup = $popup.dxPopup ('instance'), data = popup.content ().dxForm ('instance').option ('formData')

	if (!data.label) die ('label', 'Напишите что-нибудь, пожалуйста')
	
	if (!data.id_voc_project) die ('id_voc_project', 'Проект?')

	data.body = href2a (data.body)

    data.txt = (data.label + ' ' + $('.dx-htmleditor-content') [0].innerText).replace (/\s+/gsm, ' ').trim ()    

	const id = new_uuid ()

    data = await response ({action: 'create', id}, {data})

    if (await DevExpress.ui.dialog.confirm ('Задача зарегистрирована. Открыть её страницу?', 'Вопрос')) open_tab ('/tasks/' + data.uuid)
    
    popup.dispose (); $popup.remove ()

	if ($_REQUEST.type == 'tasks' && !$_REQUEST.id) {

		$('body > main').dxDataGrid ('instance').refresh ()

	} 
	else {
	
	    localStorage.setItem ('task_comment', id)
	
	}

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks_new = async function (o) {

	const {voc_projects} = $('body').data ('data')

    return {voc_projects, ...o}

}