const {Job} = require ('doix')
const {WebService} = require ('doix-http')
const {CookieJWT} = require ('doix-http-cookie-jwt')
const {HttpRequestContext} = require ('http-server-tools')
const createError = require ('http-errors')
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

			name: 'UIBackend',
	    
			methods: ['POST'],

			createError: cause => {

				const {field, message} = cause

				const o = field ? {field, message} : {success: false, dt: new Date ()}

				const {INSTANCE} = Job; if (INSTANCE in cause) o.id = cause [INSTANCE].id

				const error = createError (field ? 422 : 500, JSON.stringify (o))

				error.expose = true

				error [HttpRequestContext.CONTENT_TYPE] = 'application/json'

				return error

			},

			on: {

				start: function () {

					if (!this.user && !this.module.allowAnonymous) this.fail (new UnauthorizedError ())

				},

				end: function () {

					let content = this.result ?? null

					if (Array.isArray (content) && COUNT in content) content = {
						[content [QUERY].tables [0].alias]: content,
						cnt: content [COUNT],
						portion: content [QUERY].options.limit,
					}

					this.result = {
						success: true,
						content,
					}

				},

			},

	    })

	    new CookieJWT ({ttl: timeout, name: 'sid'}).plugInto (this)

	}

}