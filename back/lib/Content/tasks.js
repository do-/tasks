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

},

// #############################################################################

get: async function () {

    let data = await this.db.get ([{tasks: {uuid: this.q.id}}])

    data.users = Object.values (await this.db.fold ([{task_users: {id_task: data.id}}, 'users'], (i, idx) => {
    
        let user = {id: i ['users.id'], label: i ['users.label']}
        
        data [i.is_author ? 'author' : 'executor'] = user
        
        idx [user.id] = user
    
    }, {})).sort ((a, b) => a > b)   
    
    await this.db.add (data, [    
        {task_notes: {
            id_task: data.id,
            ORDER:   'id',
        }}
    ])

    return data

}

}