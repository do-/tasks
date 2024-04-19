const nodemailer                    = require ('nodemailer')
const {Application, PasswordShaker} = require ('doix')
const {DbPoolPg}                    = require ('doix-db-postgresql')

const DB                            = require ('./DB.js')
const BackService                   = require ('./BackService.js')
const PictureExtractor              = require ('./PictureExtractor.js')

const MailChannel                   = require ('./MailChannel.js')

module.exports = class extends Application {

	constructor (conf, logging) {		
					
	    super ({
	    	
	    	logger: logging.app,
	    
			globals: {
				conf,
			    pwd: new PasswordShaker ({path: conf.auth.salt_file}),
				smtp: nodemailer.createTransport (conf.mail),
				pix: new PictureExtractor (conf.pics),
			},

			pools: {
				db: new DB (conf.db, logging.db),
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

					if (this.rq.action) for (const db of this.resources (DbPoolPg)) this.waitFor (db.begin ())

				},

				end: function () {
				
					for (const db of this.resources (DbPoolPg)) this.waitFor (db.commit ())

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

		{
			const {auth: {sessions}} = conf
			this.backService = new BackService (this, {sessions})
		}

		this.mailChannel = new MailChannel (this)

	}

	async init () {

		await this.createJob ({type: 'app', action: 'init'}).toComplete ()

	}

}