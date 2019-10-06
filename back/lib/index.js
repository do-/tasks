const Content = require ('./Content.js')

_ ()

async function _ () {

    let conf = new (require ('./Config.js'))

    try {
        await migrate (conf.pools.db)
    }
    catch (x) {
        return darn (['DB MIGRATION FAILED', x])
    }

    Content.create_http_server (conf)

}

async function migrate (db) {

    await db.load_schema ()

    let patch = db.gen_sql_patch ()

    patch.unshift ({sql: "SELECT set_config ('tasks.id_user', ?, false)", params: ['00000000-0000-0000-0000-000000000000']})
    patch.push ({sql: "SELECT set_config ('tasks.id_user', NULL, false)"})

    await db.run (patch)

}