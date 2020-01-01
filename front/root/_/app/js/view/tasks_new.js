$_DRAW.tasks_new = async function (data) {

	let $view = await draw_popup ('tasks_new', data)

    $('#img', $view).show_block ('img')

    return $view

}