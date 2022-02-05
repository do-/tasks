////////////////////////////////////////////////////////////////////////////////

$_DO.update_tasks_new = async function () {

	let data = $('div.dx-popup.dx-widget').dxPopup ('instance').content ().dxForm ('instance').option ('formData')

	if (!data.label) die ('label', 'Напишите что-нибудь, пожалуйста')
	
	if (!data.id_voc_project) die ('id_voc_project', 'Проект?')

	data.body = href2a (data.body)
    
    data = await response ({action: 'create', id: new_uuid ()}, {data})

    if (await DevExpress.ui.dialog.confirm ('Задача зарегистрирована. Открыть её страницу?', 'Вопрос')) open_tab ('/tasks/' + data.uuid)
 
    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks_new = async function (o) {

	const {voc_projects} = $('body').data ('data')

    return {voc_projects, ...o}

}