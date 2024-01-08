const {Application, PasswordShaker} = require ('doix')

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