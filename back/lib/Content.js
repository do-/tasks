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
                return this.h.db.do ('DELETE FROM sessions WHERE client_cookie = ?', [this.id])                
            }
            
            restrict_access () {
                let q = this.h.q
                if (q.type != 'sessions' && q.action != 'create') throw '401 Authenticate first'
                return undefined
            }
            
            async get_user () {

                if (!this.id) return this.restrict_access ()

                let r = await this.h.db.get ([                
                    {sessions: {client_cookie: this.id || null}},
                    'users (id, label)', 
                    'roles (name)'
                ])

                if (!r.id) return this.restrict_access ()

                return {
                    id: r ['users.id'], 
                    label: r ['users.label'], 
                    role: r ['roles.name']
                }

            }

        } ({
            cookie_name: $_CONF.auth.cookie_name || 'sid',
        })
        
    }
    
    get_method_name () {
        let q = this.q
        if (q.part)   return 'get_' + q.part
        if (q.action) return 'do_'  + q.action
        return q.id ? 'get': 'select'
    }

}