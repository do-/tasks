const nodemailer                    = require ('nodemailer')

const {Application, JobSource}      = require ('doix')
const {PasswordShakerFile}          = require ('pwd-shaker')

const DB                            = require ('./DB.js')
const BackService                   = require ('./BackService.js')
const PictureExtractor              = require ('./PictureExtractor.js')

const MailRouter                    = require ('./MailRouter.js')

module.exports = class extends Application {

	constructor (conf, logger) {		

	    super ({
	    	
	    	logger,
	    
			globals: {
				conf,
			    pwd: new PasswordShakerFile ({path: conf.auth.salt_file}),
				smtp: nodemailer.createTransport (conf.mail),
				pix: new PictureExtractor (conf.pics),
			},

			pools: {
				db: new DB (conf.db, logger),
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
			this.default = new JobSource (this, {name: 'default'})
		}

		{
			const {auth: {sessions}} = conf
			this.backService = new BackService (this, {sessions})
		}		

	}

	async init () {

		await this.default.createJob ({type: 'app', action: 'init'}).outcome ()

		this.mailRouter = new MailRouter (this)

	}

}