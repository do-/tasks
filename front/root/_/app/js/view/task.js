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
    
        $('title').text (data.label + ' (' + from_to (data, data.author.id) + ')')
                        
        $.each (data.task_notes, function () {

            this.html_body = txt2html (String (this.body || ''))
            
            if (this.is_illustrated) {
            
                if (this.ext == 'mp4') {
                    this.video_url = '/_pics/' + this.ts.substr (0, 10).replace (/-/g, '/') + '/' + this.uuid + '.' + this.ext
                }
                else {
                    this.img_url = '/_pics/' + this.ts.substr (0, 10).replace (/-/g, '/') + '/' + this.uuid + '.' + (this.ext || 'png')
                }                            
            
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
        
        $('main footer').show_block ('task_footer')
        
//        if (data._can.comment) document.onpaste = $_DO.paste_task
        
    }

});