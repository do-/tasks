const Dia = require ('./Ext/Dia/Dia.js')

function get_function_name (q) {
    if (q.part)   return 'get_' + q.part
    if (q.action) return 'do_'  + q.action
    return q.id ? 'get': 'select'
}

async function handle () {
    
    this.q = Dia.get_request (this.rq)
    let function_name = get_function_name (this.q)

    let label = `${this.q.type} ${function_name} ${this.uuid}`
    console.time (label)

    var module = Dia.require_fresh (this.q.type)
    
    try {

        if (!module) throw `No code defined for ${this.q.type}`

        var fun = module [function_name]; if (!fun) throw `No ${name} defined for ${this.q.type}`

        Dia.out_json (this.rp, 200, {success: true, content: await fun.call (this)})

    }
    catch (x) {
    
        darn ([this.uuid, x])
        Dia.out_json (this.rp, 500, {success: false, id: this.uuid, dt: new Date ().toJSON ()})

    }
    
    console.timeEnd (label)

}

Dia.listen ((rq, rp) => {handle.call (new Dia.Request ({rq: rq, rp: rp}))})