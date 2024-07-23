const nodemailer                    = require ('nodemailer')
const {Application, PasswordShaker} = require ('doix')

const DB                            = require ('./DB.js')
const BackService                   = require ('./BackService.js')
const PictureExtractor              = require ('./PictureExtractor.js')

const MailRouter                    = require ('./MailRouter.js')

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

	}

	async init () {

		await this.createJob ({type: 'app', action: 'init'}).toComplete ()

		this.mailRouter = new MailRouter (this)

	}

}