const process        = require ('process')
const Application    = require ('./lib/Application.js')
const createLogger   = require ('./Logger.js')
const {DbListenerPg} = require ('doix-db-postgresql')
const {HttpRouter}   = require ('doix-http')

const conf = require ('./lib/Conf.js'), {listen, db} = conf

const logging = {}; for (const name of ['app', 'db']) logging [name] = createLogger (conf, name)

const dbListener = new DbListenerPg ({db, logger: logging.db})
const httpRouter = new HttpRouter   ({listen, logger: logging.app})

async function main () {

    const app = new Application (conf, logging)
    await app.init ()

    dbListener.add (app.mailChannel)
    httpRouter.add (app.backService)

    await dbListener.listen ()
    httpRouter.listen ()

}

main ()
        

/*
const exit = _ => app.perform ('stop')

for (const signal of ['SIGTERM', 'SIGINT', 'SIGBREAK']) process.on (signal, exit)
*/
