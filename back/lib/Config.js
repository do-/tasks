const http = require ('http')
const fs   = require ('fs')
const url  = require ('url')

var $_CONF = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

var $_REQUEST

function darn (o) {
    console.log (o)
    return (o)
}

function handler (rq, rp) {
  
  var uri = url.parse (rq.url)
  var params = new URLSearchParams (uri.search);
  $_REQUEST = {}; for (var k of ['type', 'id', 'action', 'part']) if (params.has (k)) $_REQUEST [k] = params.get (k)
  
darn ($_REQUEST)
  
  var module = require ('./Content/' + $_REQUEST.type + '.js')
  
  var method = 
    $_REQUEST.part ? 'get_' + $_REQUEST.part : 
    $_REQUEST.action ? 'do_' + $_REQUEST.action : 
    'select'
    
darn (method)
  
  var data = module [method] ()
    
  rp.statusCode = 200
  rp.setHeader ('Content-Type', 'application/json')
  rp.end (JSON.stringify ({
    success: true,
    content: data,
  }))
  
}

http.createServer (handler).listen ($_CONF.listen.port, $_CONF.listen.host, () => {
  console.log (`Server running at http://${$_CONF.listen.host}:${$_CONF.listen.port}/`);
})