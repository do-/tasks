const fs         = require ('fs')
const nodemailer = require ('nodemailer')
const Dia        = require ('./Ext/Dia/Dia.js')
const HashCalc   = require ('./Ext/Dia/Crypto/FileSaltHashCalculator.js')
const FileSystem = require ('./Ext/Dia/FileSystem/Base.js')

module.exports = class extends Dia.Config {

    constructor () {

        super (process.argv [2] || '../conf/elud.json', 'utf8')
        
        this.check_pics ()
        
        this.pools = {
            mail      : this.setup_mail (),
            db        : this.setup_db (),
			pwd_calc  : new HashCalc (this.auth),
			f_s 	  : new Dia.factory (FileSystem, { 
				root  : this.pics,   
			}),			
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
    
        let model = new (require ('./Model.js')) ({path: './Model', conf: this})

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