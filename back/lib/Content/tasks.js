const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

// #############################################################################

select: async function () {
    
    let data = {portion: 100}
    
    return await this.db.add_all_cnt (data, [

        {tasks : {
            id_user: 1
        }}, 
        
        'task_notes(*) ON id_last_task_note',

    ], data.portion)

},

// #############################################################################

get_vocs: async function () {

    return await this.db.add_vocabularies ({}, {
        users: {filter: 'id > 0'}
    })

}

// #############################################################################

}