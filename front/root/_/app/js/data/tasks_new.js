////////////////////////////////////////////////////////////////////////////////

$_DO.update_tasks_new = async function (data) {

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