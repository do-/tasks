const Dia = require ('./Ext/Dia/Dia.js')
const { Client } = require ('pg')

class WebUiRequest extends Dia.Request {
    
    get_method_name () {
        let q = this.q
        if (q.part)   return 'get_' + q.part
        if (q.action) return 'do_'  + q.action
        return q.id ? 'get': 'select'
    }

    async lock_resources () {
        this.client = new Client ($_CONF.db)
        await this.client.connect ()
    }

    async unlock_resources () {
        await this.client.end ()
    }
    
    async process_params () {
        
        super.process_params ()
        
        console.log (`${this.uuid}: ${this.module_name} ${this.method_name}`)

        console.time (this.label)

        try {
            this.out (await this.get_method ().call (this))
        }
        catch (x) {
            this.carp (x)
        }

    }

}

Dia.HTTP.listen ((rq, rp) => {

    new WebUiRequest ({
        http_request: rq, 
        http_response: rp
    })

})