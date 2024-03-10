const {WebService, HttpParamReader, HttpResultWriter} = require ('doix-http')
const {DbPool} = require ('doix-db')
const {CookieJWT} = require ('doix-http-cookie-jwt')

const QUERY = Symbol.for ('query')
const COUNT = Symbol.for ('count')

class UnauthorizedError extends Error {

	constructor () {
	
		super ('Unauthorized')
		
		this.code = 401
	
	}

}

module.exports = class extends WebService {

	constructor (app, {sessions: {timeout}}) {
		
	    super (app, {
	    
			methods: ['POST'],

			reader: new HttpParamReader ({
				from: {
					searchParams: true,
					bodyString: s => JSON.parse (s),	
				}
			}),

			on: {

				start: function () {

					if (this.rq.action)
					
						for (const db of this.resources (DbPool))

							if (typeof db.begin === 'function')
						
								this.waitFor (db.begin ())

				},

				module: function () {

					if (this.user) {

						if (this.rq.action) this.waitFor (this.db.do (`SELECT set_config (?, ?, TRUE)`, ['app.user', this.user.uuid]))

					}
					else {

						if (!this.module.allowAnonymous) this.fail (new UnauthorizedError ())

					}

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

			writer: new HttpResultWriter ({

				type: 'application/json',

				stringify: content => {

					if (Array.isArray (content) && COUNT in content) content = {
						[content [QUERY].tables [0].alias]: content,
						cnt: content [COUNT],
						portion: content [QUERY].options.limit,
					}				
				
					return JSON.stringify ({
						success: true, 
						content, 
					})
				
				}

			}),

			dumper: new HttpResultWriter ({

				code: err =>

					'code'  in err && /^[1-5]\d\d$/.test (err.code) ? err.code :

					'field' in err ? 422 :

					500,

				type: 'application/json',

				stringify: (err, job) => JSON.stringify (
					'field' in err ? {
						field: err.field,
						message: err.message
					}
					: {
						success: false,
						id: job.uuid,
						dt: new Date ().toJSON ()
					}					
				)
				
			}),

	    })

	    new CookieJWT ({ttl: timeout}).plugInto (this)

	}

}