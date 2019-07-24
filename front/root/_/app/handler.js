if (window.__LOGOUT__) delete window.__LOGOUT__

function get_default_url () {

    return '/tasks'

}

function setup_request () {

    var parts = location.pathname.split ('/').filter (function (i) {return i})
    
    if (!parts.length && $_USER && $_USER.role) return redirect (window.name = get_default_url ())

    $_REQUEST = {type: parts [0]}
    
    if (parts [1]) $_REQUEST.id = parts [1]

}

function reload_page () { location.reload () }

function _ts (r, _, v) {
    if (!v) return ''
    let [ymd, hms] = v.split ('T')
    let [y, m, d]  = ymd.split ('-')
    let hm = hms.slice (0, 5)
    y %= 100
    return `${d}.${m}.${y} ${hm}`
}

function _io (users, me) {
    return function (r, _, v) {
        if (v == $_USER.id) return me
        let fi = users [v]
        if (!fi) return '[закрыто]'
        var [f, i] = fi.split (' ')
        return i + ' ' + f.charAt (0) + '.'
    }
}

function svg (icon) {return staticURL (            
    `libs/tasks/svg/${icon}.svg`            
)}

clearTimeout (window.alarm)

$_SESSION.beforeExpiry ($_SESSION.keepAlive)

window.addEventListener ('storage', $_SESSION.closeAllOnLogout)

if ($_USER && $_USER.opt && $_USER.opt.no_tabs) openTab = function (url, name) {
    window.name = name || url
    location = url
}

setup_request ()

show_block ($_USER ? 'main' : 'login')