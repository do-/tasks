const Content = require ('./Content.js')

_ ()

async function _ () {

    let conf = new (require ('./Config.js'))

    migrate (conf.pools.db)

    conf.pools.queue = Content.create_queue (conf)

    Content.create_http_server (conf)

}

async function migrate (db) {

    await db.load_schema ()
/*
    let tables = db.model.tables
    let is_old = tables.users.existing.pk == 'id'

    let to_uuid = ['users']
    
    if (is_old) for (let tn of to_uuid) {
        let d = clone (tables [tn])
        d.name += '_'
        d.pk = 'uuid'
        delete d.columns.id
        delete d.existing
        tables [d.name] = d
    }
*/
    let patch = db.gen_sql_patch ()

//    if (is_old) for (let tn of to_uuid) patch.unshift ({sql: `DROP TABLE IF EXISTS ${tn}_`, params: []})

    await db.run (patch)

}