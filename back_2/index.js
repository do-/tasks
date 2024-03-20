const process      = require ('process')
const conf         = require ('./lib/Conf.js')
const Application  = require ('./lib/Application.js')

const app = new Application (conf), exit = _ => app.perform ('stop')

//for (const signal of ['SIGTERM', 'SIGINT', 'SIGBREAK']) process.on (signal, exit)

app.perform ('start')