$_DRAW.help = async function (data) {

    let $body = $('main').html (await use.html ('help'))
    
    let root = $_SESSION.get ('staticRoot') + '/app/html/'
    
    $('main img').each (function () {
        let $this = $(this)
        $this.attr ('src', root + $this.attr ('src'))
    })
    
    return $body

}