const Dia        = require ('./Ext/Dia/Dia.js')
const Content    = require ('./Content.js')

_ ()

async function _ () {

    const conf = new (require ('./Config.js'))

    await conf.pools.db.update_model ()

    global.$_Q = Content.create_queue (conf)
    
    Content.create_http_server (conf)

}