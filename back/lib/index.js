const fs   = require ('fs')
const http = require ('http')
const Dia  = require ('./Ext/Dia/Dia.js')

const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))
const Content  = require ('./Content.js')
const model    = new (require ('./Model.js')) ({path: './Model'})
const db_pools = {db: Dia.DB.Pool (conf.db, model)}

if (!conf.pics) throw 'conf.pics is not defined'
if (!fs.statSync (conf.pics).isDirectory ()) throw conf.pics + 'is not a direcory'

global.$_Q = {
    
    publish: (module_name, method_name, q) => {
        
        let h = new Dia.Handler ({
            conf,
            db_pools,
            module_name, 
            method_name, 
            q,
        })
        
        setImmediate (() => h.run ())

    }

}

http.createServer (

    (request, response) => {

        new Content ({
            conf,
            db_pools,
            http: {request, response}, 
        }).run ()

    }

).listen (conf.listen, function () {
    darn ('tasks app is listening to HTTP at ' + this._connectionKey)
})