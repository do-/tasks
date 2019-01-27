const Dia = require ('./Ext/Dia/Dia.js')

let HTTP_handler = class extends Dia.HTTP.Handler {

    check () {
        super.check ()
        let m = this.http.request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }
    
    check_params () {
        super.check ()
        let h = this.http.request.headers
        let q = this.q
        this.uri = `${h.scheme}://${h.host}/${q.type}/`
        if (q.id) this.uri += q.id
    }

    get_session () {

        return new class extends this.CookieSession {

            async start () {
            
                super.start ()
                
                await this.h.db.do ("DELETE FROM sessions WHERE id_user = ?", [this.user.uuid])

                return this.h.db.insert ('sessions', {
                    id_user       : this.user.uuid,
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
                    'users (id, uuid, label)', 
                    'roles (name)'
                ])

                if (!r.id) return this.restrict_access ()
                
                let elapsed_ms = (new Date () - new Date (r.ts))
                let threshold_ms = 30000 * (this.o.timeout)
                if (elapsed_ms > threshold_ms) this.keep_alive ()

                return {
                    id: r ['users.id'], 
                    uuid: r ['users.uuid'], 
                    label: r ['users.label'], 
                    role: r ['roles.name']
                }

            }
            
            async password_hash (salt, password) {
            
                const fs     = require ('fs')
                const crypto = require ('crypto')
                const hash   = crypto.createHash ('sha256')
                const input  = fs.createReadStream (this.h.conf.auth.salt_file)

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
        let q = this.q
        if (q.part)   return 'get_' + q.part
        if (q.action) return 'do_'  + q.action
        return q.id ? 'get': 'select'
    }
    
    w2ui_filter () {
        return new (require ('./Ext/DiaW2ui/Filter.js')) (this.q)
    }

}

function http_listener (conf) {

    (request, response) => {new HTTP_handler ({
        conf, 
        pools: {
            db: conf.pools.db,
            queue: conf.pools.queue,
        }, 
        http: {request, response}}
    ).run ()}

}

module.exports.create_http_server = function (conf) {

    require ('http')
    
        .createServer (
        
            (request, response) => {new HTTP_handler ({
            
                conf, 
                
                pools: {
                    db: conf.pools.db,
                    queue: conf.pools.queue,
                }, 
                
                http: {request, response}}
                
            ).run ()}

        )
        
        .listen (
        
            conf.listen, 
            
            () => darn ('tasks app is listening to HTTP at ' + this._connectionKey)
        
        )

}

module.exports.create_queue = function (conf) {

    return {
    
        publish: (module_name, method_name, q) => {
        
            let h = new Dia.Handler ({
                conf, 
                pools: {
                    db: conf.pools.db,
                    mail: conf.pools.mail,
                }, 
                module_name, 
                method_name, 
                q
            })

            setImmediate (() => h.run ())

        }

    }

}