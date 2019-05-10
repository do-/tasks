////////////////////////////////////////////////////////////////////////////////

$_DO.update_tasks_new = async function (e) {

    let $this = $(e.target).closest ('.ui-dialog').find ('.ui-dialog-content')

    let data = values ($this)    
    
    if (!data.label) die ('label', 'Конкретизируйте, пожалуйста, тему')
    
    $this.dialog ("widget").block ()

    data = await response ({action: 'create', id: new_uuid ()}, {data})

    if (confirm ('Задача зарегистрирована. Открыть её страницу?')) open_tab ('/tasks/' + data.uuid)
 
    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks_new = async function (o) {

    return $('body').data ('data')

}