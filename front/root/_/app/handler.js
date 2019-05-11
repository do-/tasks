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

function _ts (record, ind, col_ind, data) {
    if (!data) return ''
    return data.slice (0, 10) + ' ' + data.slice (11, 19)
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