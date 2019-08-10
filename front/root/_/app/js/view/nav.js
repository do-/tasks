$_DRAW.nav = async function (data) {
    
    let $nav = $('<nav class=left-sidebar>')
    
    for (let name of ['header', 'footer']) {

        let $result = $(`<${name}>`).appendTo ($nav)

        for (let o of data [name]) {
        
            let $b = $('<button>')
                .attr ({name: o.id, title: o.label, 'data-hotkey': o.hotkey})
                .css  ({backgroundImage: `url(${svg (o.icon)})`})
                .appendTo ($result)

            if (!$_REQUEST.id && o.id == 'open_' + $_REQUEST.type) $b
                .addClass ('active')
                .attr ('name', '_')

        }

    }

    return $nav.insertBefore ($('main'))

}