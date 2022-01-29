$_DRAW.task = async function (data) {

    function from_to (data, id_from) {

        var from = id_from == data.author.id ? data.author : data.executor
        var to   = id_from == data.author.id ? data.executor : data.author

        return from.label + ' \u2192 ' + to.label

    }
    
    function href2a (s) {
    
        if (s == null) s = ''; s = String (s)
        
        const RE = /(\<[^\>]*\>)/
        
        let h = ''; for (let c of s.split (RE)) {

        	if (!RE.test (c)) c = c.replace (/https?:\/\/.+[^\s\.\,\!\?\;\:]/g, function (url) {

				url = url.replace (/[\.\,\!\?]+$/g, "")

				var txt = 'URL'

				if (/https?:\/\/wiki/.test (url)) {

					var parts = url.split ('/').pop ().split ('#')

					txt = decodeURIComponent (parts [0]).replace (/_/g, ' ')

					if (parts [1]) txt += ' / ' + decodeURIComponent (parts [1].replace (/\.([0-9A-F]{2})/g, '%$1'))

				}
				else {

					url = url.replace (/[\(\)]+$/, "")
					txt = url.split ('/') [2] + '/...'

				}

				return "<a target=_blank href='" + url + "'>[" + txt + "]</a>"

			})
			
			h += c
        
        }
        
        return h
    
    }

    function txt2html (s) {
        
        if (s == null) s = ''; s = String (s)

        var depth = 0

        return s
            .split (/[\r\n]/)
            .map (

                function (line) {

                    line = line
                        .replace (/</g, "&lt;")
                        .replace (/>/g, "&gt;")
                        .replace (/\*\*([^\*]*?)\*\*/, "<b>$1</b>")

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
    
    function note (i) {
    
        function header (i) {
            
            function to_whom () {
                
                function name (id_user) {
                    if (!id_user) return ' \u274C ' // cross
                    return data.users [id_user]
                }
                
                if (i.id_user_to == i.id_user_from) return ''
                
                return ' \u2192 ' + name (i.id_user_to) + ': '
                
            }
        
            return $('<header />')
            
                .attr ({title: i.label})
                
                .append ('<span/>').text (
                    i.ts.slice (0, 19).replace ('T', ' ') + ' ' + 
                    data.users [i.id_user_from] + to_whom () + '\xa0\xa0\xa0'
                )
                
                .append ($('<b/>').text (i.label)) 
            
        }
    
        function article (i) {
            
                function url () {
                    return '/_pics/' + i.ts.substr (0, 10).replace (/-/g, '/') + '/' + i.uuid + '.' + (i.ext || 'png')
                }

                function img () {            
                    let src = url ()
                    let $img = $(`<img src="${src}" align=right width=33% style="border:solid #999 1px;">`)
//                    clickOn ($img, () => openTab (src))
                    return $img                    
                }

                function video () {return $(
                     `<video controls width=33% style="border:solid #999 1px;float:right">
                         <source type="video/mp4" src="${url()}">
                      </video>`
                )}

                function body (html) {
                    return $('<span/>').html (html)
                }
        
            let $a = $('<article />')

            if (i.is_illustrated) $a.append (i.ext == 'mp4' ? video () : img ())
            
            if (!i.is_html) i.body = txt2html (i.body)
            
            i.body = href2a (i.body)

            $a.append (body (i.body))

            $a.append ($('<br clear=all style="height:0px;">'))

            return $a

        }

        return $('<div/>')
            .append (header (i))
            .append (article (i))
            
    }
    
    $('title').text (data.label + ' (' + from_to (data, data.author.id) + ')')
    
    let $main = $('main')
    
    for (let i of data.task_notes) $main.append (note (i))
        
    for (let i of [
        {
            name: 'back_refs',
            label: 'Ссылки сюда',
        },
        {
            name: 'refs',
            label: 'Ссылки отсюда',
        },
    ]) if ((i.refs = data [i.name]).length) {
        let $div = $('<div />').appendTo ($main)
        $div.show_block ('task_refs', i)        
    }
    
    $main.append ('<div style="height:80px">')
    
    let $footer = $('<footer/>').appendTo ($main)
    
    setTimeout (() => window.scrollTo (0, document.body.scrollHeight), 10)

    $footer.show_block ('task_footer')

    clickOn ($('article img', $main).css ('max-width', '30%'), e => open_tab (e.target.src))

    return $main
    
}