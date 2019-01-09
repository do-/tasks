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
        
        let note
        let status

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

        this.q.sort = [{field: "id", direction: "desc"}];

        let filter = this.w2ui_filter ()
        
        if (note) filter ['label ILIKE %?% OR body ILIKE %?%'] = [note, note]

        return this.db.add_all_cnt ({}, [

            {task_notes: filter}, 

            {'$tasks(uuid) ON task_notes.id_task':
                status ==  1 ? {'id_user <>': null} :
                status == -1 ? {'id_user  =': null} :
                {}
            }

        ])
        
    },
    
}