const Dia = require ('./Ext/Dia/Dia.js')

const Content = require ('./Content.js')
const model   = new (require ('./Model.js')) ({path: './Model'})
const db_pool = Dia.DB.Pool ($_CONF.db, model)

Dia.HTTP.listen ((rq, rp) => {

    new Content ({
        db_pools     : {db: db_pool},
        http_request : rq, 
        http_response: rp
    }).run ()

})