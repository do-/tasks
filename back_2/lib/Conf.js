const Path = require ('path')

const conf = require (process.argv [2] || Path.join (__dirname, '..', '..', 'back', 'conf', 'elud.json'))

module.exports = conf