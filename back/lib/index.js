const http       = require ('http')
const nodemailer = require ('nodemailer')
const Dia        = require ('./Ext/Dia/Dia.js')
const Content    = require ('./Content.js')

_ ()

async function _ () {

    const conf = new (require ('./Config.js'))

    const model    = new (require ('./Model.js')) ({path: './Model'})
    const db       = Dia.DB.Pool (conf.db, model)
    const db_pools = {db}

    await db.update_model ()

    let from = conf.mail.from
    from.name = from.label
    let mail_pools = {mail: nodemailer.createTransport (conf.mail, {from})}

    global.$_Q = {

        publish: (module_name, method_name, q) => {

            let h = new Dia.Handler ({
                conf,
                db_pools,
                mail_pools,
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

}