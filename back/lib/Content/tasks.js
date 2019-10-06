const Dia = require ('../Ext/Dia/Dia.js')
const fs = require ('fs')

class Note {

    constructor (data, id_task) {
        
        this.id_task = id_task

        for (let k of ['uuid', 'id_user_to', 'body', 'img', 'ext']) this [k] = data [k]
        
        if (this.id_user_to <= 0) this.id_user_to = null
        
        this.label = (data.label || '').trim ()
        
        if (this.body === undefined) {
            let lines  = this.label.split (/[\n\r]+/)
            this.label = lines.shift ()
            this.body  = lines.join ("\n")
        }

    }
    
    assert_path (root) {

        this.path = ''

        for (let i of new Date ().toJSON ().substr (0, 10).split ('-')) {
            this.path += `/${i}`
            let p = root + this.path
            if (!fs.existsSync (p)) fs.mkdirSync (p)
        }
        
        this.path += `/${this.uuid}.${this.ext}`

    }

    async store_image (root) {
    
        let fn = root + this.path
        
        return new Promise ((resolve, reject) => {

            fs.writeFile (root + this.path, Buffer.from (this.img, 'base64'), (err) => {
                
                if (err) return reject (err)
                
                darn ('wrote ' + fn)
                
                resolve (fn)

            })
        
        })

    }
    
    async store (db, path) {

        let wishes = []

        if (this.img) {
            this.is_illustrated = 1
            this.ext = this.ext || 'png'
            this.assert_path (path)
            wishes.push (this.store_image (path))
        }
        
        wishes.unshift (db.insert ('task_notes', this))

        return Promise.all (wishes)

    }

}

async function store_and_notify (note, action) {

    try {
    
        await note.store (this.db, this.conf.pics)

        if (action) this.queue.publish ('task_notes', action, {id: note.uuid, uri: this.uri})
        
    }
    catch (e) {
        
        if (this.db.is_pk_violation (e)) return darn (`Same uuid ${note.uuid} used twice`)
        
        throw e
    
    }

}

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_comment_tasks: 

    async function () {        
    		
		this.rq.data.id_task = this.rq.id; delete this.rq.id

		await this.fork ({type: 'task_notes', action: 'create'}, this.rq)

    },
    
////////////////////////////////////////////////////////////////////////////////

do_create_tasks: 

    async function () {
    
        let result = {uuid: this.rq.id}
        
        try {
        
            await this.db.insert ('tasks', {
                uuid:    this.rq.id,
                id_user: this.user.uuid,
                label:   this.rq.data.label,
            })
            
        }
        catch (e) {

            if (this.db.is_pk_violation (e)) return result; else throw e

        }
        
        let data = this.rq.data
        
        data.id_user_to = this.user.uuid
        
        data.uuid = data.id_task = this.rq.id; delete this.rq.id

		await Promise.all ([

			this.fork ({type: 'task_notes', action: 'create'}, this.rq),

			this.db.insert ('task_users', [0, 1].map ((i) => {return {
				id_task    : data.id_task,
				id_user    : this.user.uuid,
				is_author  : i,
			}}))

		])
        
        return result
            
    },    
    
////////////////////////////////////////////////////////////////////////////////

do_assign_tasks: 

    async function () {

        let data = this.rq.data

        if (!data.id_user_to) throw '#id_user_to#:Не указан адресат'

        data.id_task = this.rq.id; delete this.rq.id
        
        let to_task = [data.id_user_to, data.id_task]

        await Promise.all ([        
            this.db.do ('UPDATE task_users SET id_user = ?          WHERE id_task = ? AND is_author = 0', to_task),
            this.db.do ('UPDATE task_notes SET id_user_to = ?       WHERE id_task = ?', to_task),
            this.db.do ('UPDATE tasks      SET id_user_executor = ? WHERE    uuid = ?', to_task),
        ])
		
		await this.fork ({type: 'task_notes', action: 'create'}, this.rq)

    },

////////////////////////////////////////////////////////////////////////////////
    
select_tasks: 

    function () {
    
        if (!this.rq.sort) this.rq.sort = [{field: "ts", direction: "asc"}]
        
        let x = {}        
        let r = []

        for (let s of this.rq.search) switch (s.field) {
            case 'note':
            case 'is_open':
                x [s.field] = s.value
                break
            default:
                r.push (s)
        }

        this.rq.search = r
        
        let filter = this.w2ui_filter ()

        if (x.is_open != null) filter ['id_user ' + ['=', '<>'] [x.is_open]] = null

        if (x.note != null) filter.uuid = this.db.query ([{'task_notes(id_task)': {'label ILIKE %?% OR body ILIKE %?%': [x.note, x.note]}}]) 

        return this.db.add_all_cnt ({}, [
            {vw_tasks : filter}, 
            'task_notes ON id_last_task_note',
        ])

    },

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tasks: 

    function () {

        return this.db.add_vocabularies ({}, {
            users: {filter: 'uuid IN (SELECT DISTINCT id_user FROM task_users)'},
            voc_task_status: {},
        })

    },

////////////////////////////////////////////////////////////////////////////////

get_item_of_tasks: 

    async function () {

        return Promise.all ([

            this.db.get  ([{vw_tasks:   {uuid:       this.rq.id}}]),

            this.db.list ([{task_notes: {id_task:    this.rq.id, ORDER: 'ts'}}]),

            this.db.list ([{task_tasks: {id_task_to: this.rq.id, ORDER: 'vw_tasks.ts'}},
                'vw_tasks ON id_task',
            ]),

            this.db.list ([{task_tasks: {id_task:    this.rq.id, ORDER: 'vw_tasks.ts'}},
                'vw_tasks ON id_task_to',
            ]),

        ])

        return data

    }

////////////////////////////////////////////////////////////////////////////////

}