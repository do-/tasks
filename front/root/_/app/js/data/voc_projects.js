////////////////////////////////////////////////////////////////////////////////

$_DO.create_voc_projects = function (e) {

    show_block ('voc_project_popup')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.voc_projects = async function (o) {

    let data = await response ({type: 'voc_projects', part: 'vocs'})
        
    $('body').data ('data', data)
            
    data.src = $_REQUEST.type

    return data

}