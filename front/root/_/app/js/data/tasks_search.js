////////////////////////////////////////////////////////////////////////////////

$_DO.update_tasks_search = async function (e) {

    let $this = $(e.target).closest ('.ui-dialog').find ('.ui-dialog-content')

    $this.dialog ("close")

    let q = values ($this).q
    
    if (q == "") die ('q', 'Что же искать?')
    
    let m = q.match (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    
    if (m) {
        
        let id = m [0]
            
        let data = await response ({type: 'tasks', id: m [0]})
        
        if (data [0].uuid == id) return open_tab ('/tasks/' + id)
    
    }
    
    $_SESSION.set ('note', q)
    
    open_tab ('/tasks/')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.tasks_search = async function (o) {

    return o

}