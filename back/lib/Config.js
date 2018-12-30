const http = require ('http');

const hostname = '127.0.0.1';
const port = 8002;

const server = http.createServer ((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

var fs = require ('fs');

var $_CONF = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'));

server.listen ($_CONF.listen.port, $_CONF.listen.host, () => {
  console.log(`Server running at http://${$_CONF.listen.host}:${$_CONF.listen.port}/`);
});