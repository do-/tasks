////////////////////////////////////////////////////////////////////////////////

$_DO.update_voc_project_popup = async function (e) {

    let $this = get_popup ()

    let data = $this.valid_data ()

    let tia = {action: 'update', id: data.uuid}
    
    if (!tia.id) {
    
	    tia.id = new_uuid ()
	    
	    tia.action = 'create'
    
    }

    $this.block ()

    data = await response (tia, {data})

    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.voc_project_popup = async function (o) {

    let data = {...clone ($('body').data ('data')), ...o}

    return data

}