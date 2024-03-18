const {WebService, HttpParamReader, HttpResultWriter} = require ('doix-http')
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

				module: function () {

					if (this.user) {

						if (this.rq.action) this.waitFor (this.db.do (`SELECT set_config (?, ?, TRUE)`, ['app.user', this.user.uuid]))

					}
					else {

						if (!this.module.allowAnonymous) this.fail (new UnauthorizedError ())

					}

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