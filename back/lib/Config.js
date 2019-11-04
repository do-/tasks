const fs         = require ('fs')
const nodemailer = require ('nodemailer')
const Dia        = require ('./Ext/Dia/Dia.js')
const HashCalc   = require ('./Ext/Dia/Crypto/FileSaltHashCalculator.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        for (let k in conf) this [k] = conf [k]
        
        this.check_pics ()
        
        this.pools = {
            mail      : this.setup_mail (),
            db        : this.setup_db (),
			pwd_calc  : new HashCalc (this.auth),
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
	
    async init () {
    
		let db = this.pools.db
		
		await db.load_schema ()

		let patch = db.gen_sql_patch ()

		patch.unshift ({sql: "SELECT set_config ('tasks.id_user', ?, false)", params: ['00000000-0000-0000-0000-000000000000']})
		patch.push ({sql: "SELECT set_config ('tasks.id_user', NULL, false)"})

		await db.run (patch)
		
    }
    
}