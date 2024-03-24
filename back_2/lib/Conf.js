const Path = require ('path')

const conf = require (process.argv [2] || Path.join (__dirname, '..', 'conf', 'elud.json'))

if (!conf.base) conf.base = 'https://tasks.cheby.ru/'

module.exports = conf