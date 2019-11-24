$_DRAW.task_refs = async function (data) {

    for (i of data.refs) {
        i.uri = '/tasks/' + i ['vw_tasks.uuid']
        i.class = 'status-' + i ['vw_tasks.id_status']
    }
    
    let $result = await to_fill ('task_refs', data)

	$('li', $result).each (function () {
		let $this = $(this)
		let lvl = $this.attr ('data-id')
		if (lvl > 0) $this.css ('margin-left', (25 * lvl) + 'px')
	})

	$('span.clickable', $result).click (function () {
		open_tab ($(this).parent ().attr ('data-href'))	
	})

    return $result
    
}