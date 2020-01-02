////////////////////////////////////////////////////////////////////////////////

$_DO.update_tasks_new = async function (e) {

    let $this = get_popup ()

    let data = $this.valid_data ()
    
    $this.block ()

    data = await response ({action: 'create', id: new_uuid ()}, {data})

    if (confirm ('Задача зарегистрирована. Открыть её страницу?')) open_tab ('/tasks/' + data.uuid)
 
    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks_new = async function (o) {

    return o

}