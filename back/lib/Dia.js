const http = require ('http')
const fs   = require ('fs')

global.$_CONF = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

global.$_REQUEST = {}

global.darn = (o) => {
    console.log (new Date ().toISOString (), o)
    return (o)
}

exports.listen = (handler) => http.createServer (handler).listen ($_CONF.listen.port, $_CONF.listen.host, () => {
  darn (`Dia.js server running at http://${$_CONF.listen.host}:${$_CONF.listen.port}/`);
})