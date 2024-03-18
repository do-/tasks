const nodemailer                    = require ('nodemailer')
const {Application, PasswordShaker} = require ('doix')
const {DbPool}                      = require ('doix-db')

const createLogger                  = require ('./Logger.js')
const DB                            = require ('./DB.js')
const BackService                   = require ('./BackService.js')

module.exports = class extends Application {

	constructor (conf) {		
	
		const log = name => createLogger (conf, name)
				
	    super ({
	    	
	    	logger: log ('app'),
	    
			globals: {
				conf,
			    pwd: new PasswordShaker ({path: conf.auth.salt_file}),
				smtp: nodemailer.createTransport (conf.mail),
			},

			pools: {
				db: new DB (conf.db, log ('db')),
			},

			modules: {
				dir: {
					root: [__dirname],
					filter: (_, arr) => arr.at (-1) === 'Content',
				},
				watch: true,
			},

			handlers: {

				start: function () {

					if (this.rq.action)
					
						for (const db of this.resources (DbPool))

							if (typeof db.begin === 'function')
						
								this.waitFor (db.begin ())

				},

				finish: function () {
				
					for (const db of this.resources (DbPool)) {

						if (db.txn) this.waitFor (db.commit ())
						
						db.txn = null

					}

				},

				error : function (error) {

					if (typeof error === 'string') error = Error (error)
					
					while (error.cause) error = error.cause

					const m = /^#(.*?)#:(.*)/.exec (error.message); if (m) {
						error.field   = m [1]
						error.message = m [2].trim ()
					}
					
					this.error = error

				},

			},

		})

	}
	
	createBackService () {
	
		const {sessions} = this.globals.get ('conf').auth
	
		return new BackService (this, {sessions})
	
	}
	
	async perform (action) {

		await this.createJob ({type: 'app', action}).toComplete ()
	
	}

}