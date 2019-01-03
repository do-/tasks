const Dia = require ('./Ext/Dia/Dia.js')
const { Client } = require ('pg')

class WebUiRequest extends Dia.Request {
    
    get_method_name () {
        let q = this.q
        if (q.part)   return 'get_' + q.part
        if (q.action) return 'do_'  + q.action
        return q.id ? 'get': 'select'
    }
    
    async process_params () {
        
        super.process_params ()
        
        console.log (`${this.uuid}: ${this.module_name} ${this.method_name}`)

        console.time (this.label)

        try {
            this.out (await this.get_method ().call (this))
        }
        catch (x) {
            this.carp (x)
        }

    }

}

class TasksModel extends Dia.DB.Model {

    adjust_table (table) {
        
        let cols = table.columns
        
        cols.id   = 'int'
        cols.fake = 'int'
        cols.uuid = "uuid=uuid_generate_v4()",

        table.pk = 'id'

    }

    get_default_query_columns (query_part) {
        return query_part.is_root ? ['*'] : ['id', 'label']
    }

}

const model = new TasksModel ({path: './Model'})

darn (model.tables.tasks)

/*
darn (new Dia.DB.Query (model, {'tasks()': 1}, 'task_notes (*)').sql)
darn (new Dia.DB.Query (model, {'tasks()': 1}, 'task_notes (*)').sql)
*/

//darn (new Dia.DB.Query (model, 'tasks(id, uuid AS guid, label) AS r').sql)
darn (new Dia.DB.Query (model, 
    {'tasks(*)' : 1}, 
    {task_notes : {}},
).sql)

let q = new Dia.DB.Query (model, {tasks: {fake: 0, id_last_task_note: null, label: undefined}})
darn (q.sql)

const db_pool = Dia.DB.Pool ($_CONF.db, )

Dia.HTTP.listen ((rq, rp) => {

    new WebUiRequest ({
        db_pools     : {db: db_pool},
        http_request : rq, 
        http_response: rp
    })

})