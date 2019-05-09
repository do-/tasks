$_DRAW.nav = async function (data) {
    
    let $nav = $('<nav class=left-sidebar>')
    
    for (let name of ['header', 'footer']) {

        let $result = $(`<${name}>`).appendTo ($nav)

        for (let o of data [name]) {
        
            let $b = $('<button>')
                .attr ({name: o.id, title: o.label})
                .css  ({backgroundImage: `url(${svg (o.icon)})`})
                .appendTo ($result)

            if (o.id == 'open_' + $_REQUEST.type) $b.addClass ('active');
                else clickOn ($b, $_DO [o.id + '_nav'])
                
        }

    }

    return $nav.insertBefore ($('main'))

}