const http       = require ('http')
const Dia        = require ('./Ext/Dia/Dia.js')
const Content    = require ('./Content.js')

_ ()

async function _ () {

    const conf = new (require ('./Config.js'))

    await conf.pools.db.update_model ()

    global.$_Q = {
        publish: (module_name, method_name, q) => {
            let h = new Dia.Handler ({conf, pools: conf.pools, module_name, method_name, q})
            setImmediate (() => h.run ())
        }
    }

    http.createServer (Content.http_listener (conf)).listen (conf.listen, function () {
        darn ('tasks app is listening to HTTP at ' + this._connectionKey)
    })

}