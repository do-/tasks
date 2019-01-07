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
        
        let note
        let status
darn (this.q)            
        if (this.q.searchLogic == 'OR') {
        
            note = this.q.search [0].value
            this.q.search = []
            
        }
        else if (this.q.searchLogic == 'AND') {
        
            let r = []

            for (let s of this.q.search) switch (s.field) {
                case 'note':
                    note = s.value
                case 'status':
                    status = s.value
                default:
                    r.push (s)
            }
            
            this.q.search = r
        
        }

        let filter = {ORDER: 'task_notes.id DESC'}

        if (note) filter ['label ILIKE %?% OR body ILIKE %?%'] = [note, note]

        return this.db.add_all_cnt (data, [

            {task_notes: filter}, 

            {'$tasks(uuid) ON task_notes.id_task':
                status ==  1 ? {'id_user <>': null} :
                status == -1 ? {'id_user  =': null} :
                {}
            }

        ], data.portion)
        
    },
    
}
