module.exports = {

//////////////
  get_vocs: //
//////////////

    function () {

        return this.db.add_vocabularies ({}, {
            users: {filter: 'id > 0'}
        })

    },
    
////////////
  select: //
////////////

    function () {

        let data = {portion: 100}
        let status

        return this.db.add_all_cnt (data, [

            {task_notes: {ORDER: 'task_notes.id DESC'}}, 
            
            {'$tasks(uuid) ON task_notes.id_task':
                status ==  1 ? {'id_user <>': null} :
                status == -1 ? {'id_user  =': null} :
                {}
            }

        ], data.portion)
        
    },
    
}
