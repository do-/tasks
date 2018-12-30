const Dia = require ('./Ext/Dia/Dia.js')

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
        .then  ((it) => Dia.out_json  (rp, 200, {success: true, content: it}))
        .catch ((ex) => Dia.out_error (rp, ex))

}

Dia.listen ((rq, rp) => {
    Dia.parse_request (rq)    
    handle_valid_request (rp)
})