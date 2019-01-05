const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////
  select: //
////////////

    function () {

        return this.db.add ({}, [{users: {'id >': 0}}, 'roles AS role'])

    },

/////////
  get: //
/////////

    function () {
        
        return this.db.get ([{users: 

            {uuid: this.q.id},

        }, 'roles AS role'])

    },

}