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
		    queue     : this.setup_queue (),            
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
    
	setup_queue () {
	
		let conf = this

		return {

			publish: (module_name, method_name, rq) => {

				let h = new Dia.Handler ({
					conf, 
					pools: {
						db: this.pools.db,
						mail: this.pools.mail,
					}, 
					module_name, 
					method_name, 
					rq
				})

				setImmediate (() => h.run ())

			}

		}

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