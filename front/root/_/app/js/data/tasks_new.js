////////////////////////////////////////////////////////////////////////////////

$_DO.update_tasks_new = async function (e) {

    var f = w2ui ['tasks_new_form']

    var v = f.values ()
    
    if (!v.label) die ('label', 'Конкретизируйте, пожалуйста, тему')
    
    v.img = $('input[name=img]').val ()
    v.ext = $('input[name=ext]').val ()

    f.lock ()

    let data = await response ({action: 'create'}, {data: v}) 
    
    w2ui ['tasksGrid'].reload ()

    w2popup.close ()
    
    w2confirm ('Задача зарегистрирована. Открыть её страницу?').yes (function () {openTab ('/tasks/' + data.uuid)})

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks_new = async function (o) {

    return $('body').data ('data')

}