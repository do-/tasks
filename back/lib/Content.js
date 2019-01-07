const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class extends Dia.HTTP.Handler {

    check () {
        super.check ()
        let m = this.http_request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }
    
    get_session () {

        return new class extends this.CookieSession {
        
            async start () {
            
                super.start ()
                
                await this.h.db.do ("DELETE FROM sessions WHERE id_user = ?", [this.user.id])

                return this.h.db.insert ('sessions', {
                    id_user       : this.user.id,
                    ts            : new Date (),
                    client_cookie : this.id,                    
                })
                
            }
            
            async finish () {            
                super.finish ()                
                return this.h.db.do ('DELETE FROM sessions WHERE client_cookie = ?', [this.old_id])
            }
            
            restrict_access () {
                let q = this.h.q
                if (q.type != 'sessions' && q.action != 'create') throw '401 Authenticate first'
                return undefined
            }
            
            keep_alive () {            
                setImmediate (() => 
                    this.h.db.do ('UPDATE sessions SET ts = ? WHERE client_cookie = ?', [new Date (), this.id])
                )
            }

            async get_user () {

                if (!this.id) return this.restrict_access ()
                
                let ts = new Date ()
                ts.setMinutes (ts.getMinutes () - this.o.timeout - 1)

                let r = await this.h.db.get ([                
                    {sessions: {
                        client_cookie: this.id,
                        'ts >=':       ts,
                    }},
                    'users (id, label)', 
                    'roles (name)'
                ])

                if (!r.id) return this.restrict_access ()
                
                let elapsed_ms = (new Date () - new Date (r.ts))
                let threshold_ms = 30000 * (this.o.timeout)
                if (elapsed_ms > threshold_ms) this.keep_alive ()

                return {
                    id: r ['users.id'], 
                    label: r ['users.label'], 
                    role: r ['roles.name']
                }

            }
            
            async password_hash (salt, password) {
            
                const fs     = require ('fs')
                const crypto = require ('crypto')
                const hash   = crypto.createHash ('sha256')
                const input  = fs.createReadStream ($_CONF.auth.salt_file)

                return new Promise ((resolve, reject) => {

                    input.on ('error', reject)

                    input.on ('end', () => {
                        hash.update (salt, 'utf8')
                        hash.update (password, 'utf8')
                        resolve (hash.digest ('hex'))
                    })

                    input.pipe (hash, {end: false})

                })

            }

        } ({
            cookie_name: $_CONF.auth.sessions.cookie_name || 'sid',
            timeout: $_CONF.auth.sessions.timeout || 10,
        })
        
    }
    
    get_method_name () {
        let q = this.q
        if (q.part)   return 'get_' + q.part
        if (q.action) return 'do_'  + q.action
        return q.id ? 'get': 'select'
    }

}