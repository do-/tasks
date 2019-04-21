$_DRAW.task_footer = async function (data) {

    let $a = $('<span />')

    if (!data.buttons) return $a

    for (i of data.buttons) {

        let $b = $('<button>')
            .attr ({title: i.title})
            .data ('data', i.data)
            .appendTo ($a)
                
        if (i.id) {
            $b
                .attr ({name: i.id})
                .addClass ('svg-' + i.id)
        }
        else {

            function nick (s) {
            
                function ucfirst (s) {return s.charAt (0).toUpperCase ()}                
            
                var p = i.title.split (/\s+/)
                if (p.length == 1) return ucfirst (p [0])
                return ucfirst (p [1]) + ucfirst (p [0])
                
            }
            
            function css (s) {
            
                function hsl (label) {
                    let s = 0; for (var i = 0; i < label.length; i ++) s += 513 * label.charCodeAt (i)
                    return 'hsl(' + (s % 360) + ',50%,40%)'
                }
                
                let c = hsl (s)
                return {'background-color': c, 'border-color': c}
                
            }
                    
            $b
                .text (nick (i.title))
                .css (css (i.title))                         
        
        }

        clickOn ($b, $_DO.click_task_footer)            

    }
    
    return $a.children()

}