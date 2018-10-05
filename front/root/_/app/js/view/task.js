define ([], function () {        
    
    function from_to (data, id_from) {
    
        var from = id_from == data.author.id ? data.author : data.executor
        var to   = id_from == data.author.id ? data.executor : data.author
        
        return from.label + ' \u2192 ' + to.label

    }
    
    function txt2html (s) {
        
        var depth = 0
        
        return s
            .split (/[\r\n]/)
            .map (
            
                function (line) {

                    line = line
                        .replace (/[<>]/g, "")
                        .replace (/\*\*([^\*]*?)\*\*/g, "<b>$1</b>")
                        .replace (/https?:\/\/\S+/g, function (url) {
                        
                            var txt = 'URL'
                            
                            if (/https?:\/\/wiki/.test (url)) {
                                                            
                                var parts = url.split ('/').pop ().split ('#')
                            
                                txt = decodeURIComponent (parts [0]).replace (/_/g, ' ')
                                
                                if (parts [1]) txt += ' / ' + decodeURIComponent (parts [1].replace (/\.([0-9A-F]{2})/g, '%$1'))
                                
                            }
                            else {
                            
                                txt = url.split ('/') [2] + '/...'
                            
                            }
                            
                            return "<a href='" + url + "'>[" + txt + "]</a>"
                            
                        })

                    var stars = 0

                    for (i = 0; i < line.length; i ++) {
                        if (line.charAt (i) != '*') break
                        stars ++
                    }

                    var delta = stars - depth

                    var s = delta == 0 ? '' : (delta > 0 ? '<ul>' : '</ul>').repeat (Math.abs (delta))

                    depth = stars

                    return s + (depth ? '<li>' : '<p>') + line.substr (depth)

                }
                
            )
            .join ('')

    }
        
    return function (data, view) {
    
        $('body').data ('data', data)

        data._can = {
            comment: data.id_user > 0 && data.users [$_USER.id],
        }

        data._can.close = data._can.comment && data.author.id == $_USER.id

        data._can.assign = data._can.close && data.author.id == data.executor.id

        $('title').text (data.label + ' (' + from_to (data, data.author.id) + ')')
                        
        $.each (data.task_notes, function () {

            this.html_body = txt2html (String (this.body || ''))
            
            if (this.is_illustrated) {
                
                this.img_url = '/_pics/' + this.ts.substr (0, 10).replace (/-/g, '/') + '/' + this.uuid + '.png'
            
            }

            this.from_to = data.users [this.id_user_from]
            
            if (this.id_user_to == this.id_user_from) return
            
            if (!this.id_user_to) {
                this.from_to += ' \u2192 \u274C'
            }
            else {
                this.from_to += ' \u2192 '
                this.from_to += data.users [this.id_user_to]
            }
            
        })

        fill (view, data, $('main'))
        
        $('img').each (function () {
            clickOn ($(this), function () {
                openTab (this.src)
            })
        })
        
        $('header b').each (function () {var $this = $(this); $this.attr ('title', $this.text ())})
        
        window.scrollTo (0, document.body.scrollHeight);
        
        if (data._can.comment) document.onpaste = $_DO.paste_task
        
        $('button.peer').each (function () {
        
            var $this = $(this)
        
            var data = $this.data ('data')
            
            var label = data.label
            var s = 0; for (var i = 0; i < label.length; i ++) s += 513 * label.charCodeAt (i)
            var hsl = 'hsl(' + (s % 360) + ',50%,40%)'
            
            clickOn ($this.attr ({title: label}).css  ({
                'background-color': hsl,
                'border-color': hsl,
            }), $_DO.assign_task)
        
        })

    }

});