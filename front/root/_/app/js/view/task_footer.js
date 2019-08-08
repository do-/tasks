$_DRAW.task_footer = async function (data) {

    function button (i) {
    
        let $b = $('<button>')
            .attr ({title: i.title})
            .data ('data', i.data)

        function set_id (id) {
        
            $b
                .attr     ({name: id})
                .css  ({backgroundImage: `url(${svg (i.id)})`})
        
        }
    
        function set_label (title) {

            function nick (s) {                        
                return s.split (/\s+/).slice (0, 2).reverse ().map (s => s.charAt (0).toUpperCase ()).join ('')                
            }
            
            function css (s) {
            
                function hsl (label) {
                    let sum = 0; for (var i = 0; i < label.length; i ++) sum += 513 * label.charCodeAt (i)
                    return `hsl(${sum % 360},50%,40%)`
                }
                
                let c = hsl (s)
                return {'background-color': c, 'border-color': c}
                
            }
                    
            $b
                .text (nick (title))
                .css (css (title))                         

        }
                
        if (i.id) set_id (i.id); else set_label (i.title);

        clickOn ($b, $_DO.click_task_footer)            
        
        return $b
    
    }

    let $a = $('<span />'); if (data.buttons) for (i of data.buttons) $a.append (button (i))    
    
    $(window).keyup ((e) => {
    
        if (!e.ctrlKey && !e.altKey) switch (e.key) {
            case 'F4': return $('button[name=return]').click ()
            case 'F8': return $('button[name=comment]').click ()
        }
        
        if ( e.ctrlKey && !e.altKey) switch (e.key) {
            case 'Enter': return $('button[name=update]').click ()
        }

    })
    
    clickOn ($('<button name=fork title="Создать подзадачу">+</button>').appendTo ($a), $_DO.fork_task)

    return $a.children ()

}