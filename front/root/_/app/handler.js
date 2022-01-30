clearTimeout (window.alarm); if (window.__LOGOUT__) delete window.__LOGOUT__

function setup_request () {

    let [type, id] = location.pathname.split ('/').filter (i => i)

    $_REQUEST = {type, id}
    
    if (!$_USER) return

    if (!$_REQUEST.type) return redirect (window.name = '/tasks')
    
    let name = '/' + type 
    if (id) name += '/' + id 
    
    window.name = name
    
    $_SESSION.beforeExpiry ($_SESSION.keepAlive)
    
    window.addEventListener ('storage', $_SESSION.closeAllOnLogout)

}

function _ts (r, _, v) {
    if (!v) return ''
    let [ymd, hms] = v.split ('T')
    let [y, m, d]  = ymd.split ('-')
    let hm = hms.slice (0, 5)
    y %= 100
    return `${d}.${m}.${y} ${hm}`
}

function svg (icon) {return staticURL (            
    `libs/tasks/svg/${icon}.svg`            
)}

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

if ($_USER && $_USER.opt && $_USER.opt.no_tabs) open_tab = openTab = function (url, name) {
    window.name = name || url
    location = url
}

setup_request ()

$(window).keydown (check_hotkeys)

DevExpress.localization.locale ('ru')

show_block ($_USER ? 'main' : 'login')