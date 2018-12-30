const Dia  = require ('./Dia.js')

const url  = require ('url')

function parse_request (rq) {

    var uri = url.parse (rq.url)

    var params = new URLSearchParams (uri.search);

    $_REQUEST = {}; for (var k of ['type', 'id', 'action', 'part']) if (params.has (k)) $_REQUEST [k] = params.get (k)

}

function out_json (rp, code, page) {
    rp.statusCode = code
    rp.setHeader ('Content-Type', 'application/json')
    rp.end (JSON.stringify (page))
}

function out_error (rp, ex) {
    function s4 () {return Math.floor((1 + Math.random()) * 0x10000).toString (16).substring (1)}
    var id = s4 () + s4 () + '-' + s4 () + '-' + s4 () + '-' + s4 () + '-' + s4 () + s4 () + s4 ()
    darn ([id, ex])
    out_json (rp, 500, {success: false, id: id, dt: new Date ().toJSON ()})
}

function handle_valid_request (rp) {

    var module = require ('./Content/' + $_REQUEST.type + '.js')
    if (!module) return out_error (rp, `No code defined for ${$_REQUEST.type}`)

    var name = 
        $_REQUEST.part   ? 'get_' + $_REQUEST.part   : 
        $_REQUEST.action ? 'do_'  + $_REQUEST.action : 
        $_REQUEST.id     ? 'get'                     : 
                           'select'

    var fun = module [name]; 
    if (!fun) return out_error (rp, `No ${name} defined for ${$_REQUEST.type}`)

    new Promise (fun)
        .then  ((it) => out_json  (rp, 200, {success: true, content: it}))
        .catch ((ex) => out_error (rp, ex))

}

function handler (rq, rp) {

    parse_request (rq)  
  
darn ($_REQUEST)
  
    handle_valid_request (rp)

}

Dia.listen (handler)