const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

// #############################################################################

select: async function () {
        
    return this.db.add ({}, [{users: {'id >': 0}}, 'roles AS role'])

},

// #############################################################################

}