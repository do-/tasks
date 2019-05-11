////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_peers = async function (e) {

    let $this = $(e.target).closest ('.ui-dialog').find ('.ui-dialog-content')

    let data = values ($this)    
    
    let ids = []; for (let uuid in data) if (data [uuid]) ids.push (uuid)

    $this.dialog ("widget").block ()

    await response ({type: 'users', action: 'set_peers'}, {data: {ids}})

    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_peers = async function (o) {

    return response ({type: 'users', id: null, part: 'peers'})

}