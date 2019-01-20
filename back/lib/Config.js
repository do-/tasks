const fs = require ('fs')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        if (!conf.pics) throw 'conf.pics is not defined'

        if (!fs.statSync (conf.pics).isDirectory ()) throw conf.pics + 'is not a direcory'

        for (let k in conf) this [k] = conf [k]
        
    }

}