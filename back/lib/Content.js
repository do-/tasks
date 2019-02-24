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
        let rq = this.rq
        this.uri = `${h.scheme}://${h.host}/${rq.type}/`
        if (rq.id) this.uri += rq.id
    }

    get_session () {
    
        function carp (e) {if (e) darn (e)}    

        return new class extends this.CookieSession {
                
            keep_alive () {
                this.h.memcached.set (this.id, this.user.uuid, this.o.timeout * 60, carp)
            }

            async start () {            
                super.start ()
                this.keep_alive ()
            }
            
            async finish () {            
                super.finish ()
                this.h.memcached.del (this.id, carp)
            }
            
            async get_user_uuid () {

                let m = this.h.memcached
                
                return new Promise ((resolve, reject) => {

                    m.get (this.id, function (err, data) {

                        if (err) {
                            reject (err)
                        }
                        else {
                            resolve (data)
                        }

                    })
                
                })
                
            }
            
            restrict_access () {
                let rq = this.h.rq
                if (rq.type != 'sessions' && rq.action != 'create') throw '401 Authenticate first'
                return undefined
            }            

            async get_user () {

                if (!this.id) return this.restrict_access ()
                
                this.user = {is_deleted: 0}

                try {
                    if (!(this.user.uuid = await this.get_user_uuid ())) return restrict_access ()
                }
                catch (e) {
                    darn (e)
                    return this.restrict_access ()
                }
                                                
                let r = await this.h.db.get ([                
                    {'users (uuid, label)': this.user},
                    'roles (name)'
                ])

                if (!r.uuid) return this.restrict_access ()                

                this.keep_alive ()

                return {
                    uuid: r.uuid, 
                    label: r.label, 
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
        let rq = this.rq
        if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
        if (rq.action) return 'do_'  + rq.action + '_' + rq.type
        return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }
    
    w2ui_filter () {
        return new (require ('./Ext/DiaW2ui/Filter.js')) (this.rq)
    }

}

module.exports.create_http_server = function (conf) {

    require ('http')
    
        .createServer (
        
            (request, response) => {new HTTP_handler ({
            
                conf, 
                
                pools: {
                    db: conf.pools.db,
                    queue: conf.pools.queue,
                    memcached: conf.pools.memcached,
                }, 
                
                http: {request, response}}
                
            ).run ()}

        )
        
        .listen (
        
            conf.listen, 
            
            function () {
                darn ('tasks app is listening to HTTP at ' + this._connectionKey)
            }
        
        )

}

module.exports.create_queue = function (conf) {

    return {
    
        publish: (module_name, method_name, rq) => {
        
            let h = new Dia.Handler ({
                conf, 
                pools: {
                    db: conf.pools.db,
                    mail: conf.pools.mail,
                }, 
                module_name, 
                method_name, 
                rq
            })

            setImmediate (() => h.run ())

        }

    }

}