const process        = require ('process')
const Application    = require ('./lib/Application.js')
const {DbListenerPg} = require ('doix-db-postgresql')
const {HttpRouter}   = require ('doix-http')
const Path    = require ('path')
const winston = require ('winston')
const normalizeSpaceLogFormat = require ('string-normalize-space').logform

const conf = require ('./lib/Conf.js'), {listen, db} = conf
const filename = Path.join (conf.logs, 'app.log')

const logger = winston.createLogger ({
    levels: winston.config.syslog.levels,
    transports: [
//			new winston.transports.Console (),
        new winston.transports.File ({filename})
    ],
    format: winston.format.combine (
        winston.format.timestamp ({format: 'YYYY-MM-DD HH:mm:ss.SSS'})
//        , winston.format.json ()
//        , normalizeSpaceLogFormat ()
        , winston.format.printf (info => `${info.timestamp} ${info.id} ${info.message??info.event}${info.elapsed ? ' ' + info.elapsed + ' ms' : ''}${info.details ? ' ' + JSON.stringify (info.details): ''}`)
    ),
})

const dbListener = new DbListenerPg ({db, name: 'PG', channel: 'mail', logger})
const httpRouter = new HttpRouter   ({name: 'HTTP', listen, logger})

async function exit () {

    try {
        await Promise.all ([
            dbListener.close (),
            httpRouter.close (),
        ])
        process.exit (0)
    }
    catch (_) {
        process.exit (1)
    }

}

async function main () {

    for (const signal of ['SIGTERM', 'SIGINT', 'SIGBREAK']) process.on (signal, exit)

    const app = new Application (conf, logger)
    await app.init ()

    dbListener.add (app.mailRouter)
    httpRouter.add (app.backService)

    await dbListener.listen ()
    httpRouter.listen ()

}

main ()