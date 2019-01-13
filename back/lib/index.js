const fs         = require ('fs')
const http       = require ('http')
const nodemailer = require ('nodemailer')
const Dia        = require ('./Ext/Dia/Dia.js')
const Content    = require ('./Content.js')

_ ()

async function _ () {

    const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))
    if (!conf.pics) throw 'conf.pics is not defined'
    if (!fs.statSync (conf.pics).isDirectory ()) throw conf.pics + 'is not a direcory'

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