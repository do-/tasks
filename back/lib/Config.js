const fs         = require ('fs')
const nodemailer = require ('nodemailer')
const Dia        = require ('./Ext/Dia/Dia.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        for (let k in conf) this [k] = conf [k]
        
        this.check_pics ()
        
        this.pools = {
            mail      : this.setup_mail (),
            db        : this.setup_db (),
            sessions  : this.setup_sessions (),
            users     : new Dia.Cache ({name: 'user'}),
        }

    }
    
    check_pics () {

        if (!this.pics) throw 'conf.pics is not defined'

        if (!fs.statSync (this.pics).isDirectory ()) throw conf.pics + 'is not a direcory'

    }
    
    setup_mail () {
    
        let mail = this.mail
    
        let from = mail.from
        
        from.name = from.label
        
        return nodemailer.createTransport (mail, {from})
    
    }

    setup_db () {
    
        let model = new (require ('./Model.js')) ({path: './Model'})

        return Dia.DB.Pool (this.db, model)

    }
    
    setup_sessions () {
    
        return new Dia.Cache ({
        	name: 'session',
        	ttl : this.auth.sessions.timeout * 60 * 1000,
        })

    }
    
}