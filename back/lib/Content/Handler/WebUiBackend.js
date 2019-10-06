const Dia = require ('../../Ext/Dia/Dia.js')
const Session = require ('../../Ext/Dia/Content/Handler/HTTP/Session/CachedCookieSession.js')

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

    	let h = this

    	return new Session (h, {
    		sessions:    h.pools.sessions,
    		cookie_name: h.conf.auth.sessions.cookie_name || 'sid',
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