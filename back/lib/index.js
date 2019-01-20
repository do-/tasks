const Content = require ('./Content.js')

_ ()

async function _ () {

    let conf = new (require ('./Config.js'))

    await conf.pools.db.update_model ()

    conf.pools.queue = Content.create_queue (conf)

    Content.create_http_server (conf)

}