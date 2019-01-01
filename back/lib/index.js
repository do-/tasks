const Dia = require ('./Ext/Dia/Dia.js')

class WebUiRequest extends Dia.Request {
    
    constructor (o) {
        super (o)
        this.label = `${this.module_name} ${this.method_name} ${this.uuid}`
    }

    get_method_name () {
        let q = this.q
        if (q.part)   return 'get_' + q.part
        if (q.action) return 'do_'  + q.action
        return q.id ? 'get': 'select'
    }

    async run () {

        console.time (this.label)

        try {        
            this.out (await this.get_method ().call (this))
        }
        catch (x) {
            this.carp (x)
        }

        console.timeEnd (this.label)

    }

}

Dia.listen ((rq, rp) => {

    new WebUiRequest ({
        http_request: rq, 
        http_response: rp
    }).run ()

})