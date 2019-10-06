const Dia = require ('../../Ext/Dia/Dia.js')

module.exports = class extends Dia.HTTP.Handler {

    check () {
        super.check ()
        let m = this.http.request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }
    
    check_params () {
        super.check ()
        let h = this.http.request.headers
        let rq = this.rq
        this.uri = `${h.scheme}://${h.host}/${rq.type}/`
        if (rq.id) this.uri += rq.id
    }

    get_session () {

        return new class extends this.CookieSession {
        
        	time () {
        		return new Date ().getTime ()
        	}
                
            keep_alive () {
            	this.h.sessions.set (this.id, this.user.uuid)
            	return this.user
            }

            async start () {  
                await super.start ()
                this.keep_alive ()
            }
            
            async finish () {            
                await super.finish ()
                this.h.sessions.del (this.id)
            }

            restrict_access () {
            	if (!this.h.is_anonymous ()) throw '401 Authenticate first'
                return undefined
            }
            
            invalidate_user (uuid) {
            	this.h.users.del (uuid)
            }

            async get_user () {

                if (!this.id) return this.h.no_user ()
                
                let uuid = this.h.sessions.get (this.id)

                if (!uuid) {
                	darn (`session ${this.id} not found`)
                	return this.h.no_user ()
                }
                
                this.user = await this.h.users.to_get (uuid, async () => {
                	let r = await this.h.db.get ([{vw_users: {uuid}}])
                	return r.uuid ? r : null
                })
                
                if (!this.user) {
                	darn (`session ${this.id}: valid user ${uuid} not found`)
                	return this.h.no_user ()
                }

                return this.keep_alive ()
                                
            }
            
        } ({
            cookie_name: this.conf.auth.sessions.cookie_name || 'sid',
            timeout: this.conf.auth.sessions.timeout || 10,
        })
        
    }
    
    async get_user () {
        let user = await super.get_user ()
        if (!this.is_transactional () || !user) return user
        await this.db.do ("SELECT set_config ('tasks.id_user', ?, true)", [user.uuid])
        return user
    }
    
    get_method_name () {
        let rq = this.rq
        if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
        if (rq.action) return 'do_'  + rq.action + '_' + rq.type
        return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }
    
    is_anonymous () {
        return this.rq.type == 'sessions' && this.rq.action == 'create'
    }
    
    w2ui_filter () {
        return new (require ('../../Ext/DiaW2ui/Filter.js')) (this.rq)
    }
    
    async password_hash (salt, password) {
    
        const fs     = require ('fs')
        const crypto = require ('crypto')
        const hash   = crypto.createHash ('sha256')
        const input  = fs.createReadStream (this.conf.auth.salt_file)

        return new Promise ((resolve, reject) => {

            input.on ('error', reject)

            input.on ('end', () => {
                hash.update (String (salt))
                hash.update (String (password), 'utf8')
                resolve (hash.digest ('hex'))
            })

            input.pipe (hash, {end: false})

        })

    }

}