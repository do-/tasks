////////////////////////////////////////////////////////////////////////////////

$_DO.update_voc_project_popup = async function (e) {

    let $this = get_popup ()

    let data = $this.valid_data ()    

    data.uuid = new_uuid ()

    $this.block ()

    data = await response ({action: 'create'}, {data})

    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.voc_project_popup = async function (o) {

    let data = clone ($('body').data ('data'))      

    return data

}