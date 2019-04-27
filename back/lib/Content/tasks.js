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
    
        let note = new Note (this.rq.data, this.rq.id)
                
        let u = note.id_user_to

        store_and_notify.call (this, note, !u && u == this.user.uuid ? null : 'notify')

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
        
        this.rq.data.id_user_to = this.user.uuid

        let note = new Note (this.rq.data, this.rq.id)
        
        let [id_task_note] = await note.store (this.db, this.conf.pics)
        
        await this.db.insert ('task_users', [0, 1].map ((i) => {return {
            id_task    : note.id_task,
            id_user    : this.user.uuid,
            is_author  : i,
        }}))
        
        return result
            
    },    
    
////////////////////////////////////////////////////////////////////////////////

do_assign_tasks: 

    async function () {

        let note = new Note (this.rq.data, this.rq.id)        

        if (!note.id_user_to) throw '#id_user_to#:Не указан адресат'

        return Promise.all ([        
            this.db.do ('UPDATE task_users SET id_user = ?    WHERE id_task = ? AND is_author = 0', [note.id_user_to, note.id_task]),
            this.db.do ('UPDATE task_notes SET id_user_to = ? WHERE id_task = ?', [note.id_user_to, note.id_task]),
            store_and_notify.call (this, note, 'notify_assign')
        ])

    },

////////////////////////////////////////////////////////////////////////////////
    
select_tasks: 

    function () {
    
        this.rq.sort = [{field: "ts", direction: "asc"}]
        
        let x = {}
        
        if (this.rq.searchLogic == 'OR') {
            x.note = this.rq.search [0].value
            this.rq.search = []
        }
        else if (this.rq.searchLogic == 'AND') {            

            let r = []

            for (let s of this.rq.search) switch (s.field) {
                case 'note':
                case 'status':
                case 'id_other_user':
                case 'is_author':
                    x [s.field] = s.value
                    break
                default:
                    r.push (s)
            }
            
            if (x.is_author != undefined) x.is_author = (x.is_author == 1) ? 1 : 0
            
            this.rq.search = r
        
        }
        
        let filter = this.w2ui_filter ()

        if (x.status != undefined) filter ['id_user ' + (x.status ? '<>' : '=')] = null

        if (x.note != undefined) filter.uuid = this.db.query ([{'task_notes(id_task)': {'label ILIKE %?% OR body ILIKE %?%': [x.note, x.note]}}]) 

        if (x.id_other_user) filter ['uuid IN'] = this.db.query ([{'task_users(id_task)': {
            id_user   : x.id_other_user.map ((i) => i.id),
            is_author : x.is_author,
        }}])

        return this.db.add_all_cnt ({}, [
            {tasks : filter}, 
            'task_notes ON id_last_task_note',
        ])

    },

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tasks: 

    function () {

        return this.db.add_vocabularies ({}, {
            users: {filter: 'login IS NOT NULL'}
        })

    },

////////////////////////////////////////////////////////////////////////////////

get_item_of_tasks: 

    async function () {

        let data = await this.db.get ([{tasks: {uuid: this.rq.id}}])

        data.users = Object.values (await this.db.fold ([{task_users: {id_task: data.uuid}}, '$users'], (i, idx) => {

            let user = {id: i ['users.uuid'], label: i ['users.label']}

            data [i.is_author ? 'author' : 'executor'] = user

            idx [user.id] = user

        }, {})).sort ((a, b) => a > b)   

        await this.db.add (data, {
        
            task_notes: {
                id_task: data.uuid,
                ORDER:   'ts',
            }
            
        })

        data.peers = await this.db.list ([

            {users: {
                'login<>' : null,
                'uuid <>' : this.user.uuid,
            }},
            {'$user_users ON user_users.id_user_ref = users.uuid' : {
                id_user : this.user.uuid,
                is_on   : 1,
            }}

        ])    

        return data

    }

////////////////////////////////////////////////////////////////////////////////

}