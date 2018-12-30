const http = require ('http')
const fs   = require ('fs')
const url  = require ('url')

var $_CONF = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

var $_REQUEST

function handler (rq, rp) {
  
  var uri = url.parse (rq.url)
  var params = new URLSearchParams (uri.search);
  $_REQUEST = {type: params.get ('type')}
//  ['id', 'action', 'part'].forEach ((k) => {if (params.has (k)) $_REQUEST [k] = params.get (k)})
  for (var k of ['id', 'action', 'part']) if (params.has (k)) $_REQUEST [k] = params.get (k)
  
  console.log ($_REQUEST)
  
  rp.statusCode = 200
  rp.setHeader ('Content-Type', 'application/json')
  rp.end ("['Hello World']")
  
}

http.createServer (handler).listen ($_CONF.listen.port, $_CONF.listen.host, () => {
  console.log (`Server running at http://${$_CONF.listen.host}:${$_CONF.listen.port}/`);
})