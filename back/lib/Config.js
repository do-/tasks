const Dia = require ('./Ext/Dia/Dia.js')

async function handle ($_REQUEST, rp) {

    var module = Dia.require_fresh ($_REQUEST.type)
    if (!module) return Dia.out_error ($_REQUEST, rp, `No code defined for ${$_REQUEST.type}`)

    var name = 
        $_REQUEST.part   ? 'get_' + $_REQUEST.part   : 
        $_REQUEST.action ? 'do_'  + $_REQUEST.action : 
        $_REQUEST.id     ? 'get'                     : 
                           'select'

    var fun = module [name]
    if (!fun) return Dia.out_error ($_REQUEST, rp, `No ${name} defined for ${$_REQUEST.type}`)
    
    try {
        Dia.out_json ($_REQUEST, rp, 200, {success: true, content: await fun ($_REQUEST)})
    }
    catch (x) {
        Dia.out_error ($_REQUEST, rp, x)
    }

}

Dia.listen ((rq, rp) => {handle (Dia.get_request (rq), rp)})