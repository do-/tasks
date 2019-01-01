const Dia = require ('./Ext/Dia/Dia.js')

class WebUiRequest extends Dia.Request {
    
    get_method_name () {
        let q = this.q
        if (q.part)   return 'get_' + q.part
        if (q.action) return 'do_'  + q.action
        return q.id ? 'get': 'select'
    }

    async run () {

        let label = `${this.module_name} ${this.method_name} ${this.uuid}`
        console.time (label)

        var module = Dia.require_fresh (this.module_name)

        try {

            if (!module) throw `No code defined for ${this.q.type}`

            var fun = module [this.method_name]; if (!fun) throw `No ${name} defined for ${this.module_name}`

            this.out (await fun.call (this))

        }
        catch (x) {this.carp (x)}

        console.timeEnd (label)

    }

}

Dia.listen ((rq, rp) => {

    new WebUiRequest ({
        http_request: rq, 
        http_response: rp
    }).run ()

})