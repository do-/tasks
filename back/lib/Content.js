module.exports.create_http_server = function (conf) {

    require ('http')
    
        .createServer (
        
            (request, response) => {new (require ('./Content/Handler/WebUiBackend.js')) ({
            
                conf, 
                
                pools: {
                    db: conf.pools.db,
                    queue: conf.pools.queue,
                    sessions: conf.pools.sessions,
                    users: conf.pools.users,
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