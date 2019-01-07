global.W2UI_filter = class {
    
    op (src) {switch (src) {
        case 'is': return ' = ?'        
        case 'less': return ' <= ?'        
        case 'more': return ' >= ?'        
        case 'between': return 'BETWEEN ? AND ?'
        case 'begins': return ' ILIKE ?%'
        case 'ends': return ' ILIKE %?'
        case 'contains': return ' ILIKE %?%'
        case 'in': return ' IN '
        case 'not in': return ' NOT IN '
        case 'null': throw '"null" must be replaced by "is" null'
        default: throw 'Unknown op: ' + src
    }}
    
    adjust_term (s) {
    
        if (s.operator == 'null') {
            s.operator = 'is'
            s.value = null
        }
        else if (s.value == null) {
            s.value = undefined
        }
        
        s.expr = s.field + this.op (s.operator)
        
        let dt_iso = (dt) => dt.substr (0, 10)
        
        if (Array.isArray (s.value)) {
        
            s.value = s.value.map (s.type == 'date' ? dt_iso : (o) => typeof o == 'object' ? o.id : o)            
            
        }
        else {
        
            s.value = s.value.trim ()            
            if (s.expr.indexOf ('LIKE') > -1) s.value = s.value.replace (/[\*\s]+/g, '%')
            if (s.type == 'date') s.value = dt_iso (s)
        
        }
    
    }
    
    constructor (q) {
    
        this.set_sort (q.sort)
        
        if (q.search) {
        
            for (let term of q.search) this.adjust_term (term)
            
            if (q.searchLogic == 'AND') {
            
                for (let term of q.search) this [term.expr] = term.value

            }            
            else if (q.searchLogic == 'OR') {
            
                let [l, r] = [[], []]
            
                for (let term of q.search) {
                    if (term.type == 'date') continue
                    l.push (term.expr)
                    r.push (term.value)
                }
                
                this [`(l.join (' OR '))`] = r
            
            }
        
        }
        
    }
    
    set_sort (sort) {
    
        if (!sort) return
        
        this.ORDER = sort
            .map ((i) => `${i.field} ${i.direction.toUpperCase ()}`)
            .join (',')
            
    }
    
}

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

        this.q.sort = [{field: "id", direction: "desc"}];
        
        let filter = new W2UI_filter (this.q)
        
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
