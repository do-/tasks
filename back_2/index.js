const {HttpRouter} = require ('doix-http')

const conf         = require ('./lib/Conf.js'), {listen} = conf
const Application  = require ('./lib/Application.js')

const app = new Application (conf), {logger} = app, svc = app.createBackService ()

app.init ().then (() => 

	new HttpRouter ({listen, logger}).add (svc).listen (),

	x => console.error (x)

)