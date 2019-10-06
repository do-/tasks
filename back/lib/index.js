const WebUiBackend = require ('./Content/Handler/WebUiBackend.js')
const conf  = new (require ('./Config.js'))
const pools = conf.pools

;(async () => {

    try {
        conf.init ()
    }
    catch (x) {
        return darn (['Initialization failed', x])
    }

    require ('http').createServer (

        (request, response) => {new WebUiBackend ({conf, pools, http: {request, response}}).run ()}

    ).listen (

        conf.listen,

        function () {darn ('tasks app is listening to HTTP at ' + this._connectionKey)}

    )

}) ()