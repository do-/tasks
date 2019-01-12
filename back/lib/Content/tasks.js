const Dia = require ('../Ext/Dia/Dia.js')
const fs = require ('fs')
const nodemailer = require ('nodemailer')

class Note {

    constructor (data) {
        
        this.fake = 0

//                                                  TODO mail

        for (let k of ['id_user_to', 'body', 'img', 'ext']) this [k] = data [k]
        
        if (this.id_user_to <= 0) this.id_user_to = null
        
        this.label = data.label.trim ()
        
        if (this.body === undefined) {
            let lines  = this.label.split (/[\n\r]+/)
            this.label = lines.shift ()
            this.body  = lines.join ("\n")
        }

    }
    
    async fetch_id_task (db, uuid) {
        this.id_task = await db.get ([{'tasks(id)': {uuid}}])
    }
    
    async store_image (path) {

        for (let i of new Date ().toJSON ().substr (0, 10).split ('-')) {
            path += `/${i}`
            if (!fs.existsSync (path)) fs.mkdirSync (path)
        }
        
        return new Promise ((resolve, reject) => {
        
            let fn = `${path}/${this.uuid}.${this.ext}`
        
            fs.writeFile (fn, Buffer.from (this.img, 'base64'), (err) => {
                
                if (err) return reject (err)
                
                resolve (fn)
                
            })
        
        })

    }
    
    async store (db, path) {

        this.uuid = Dia.new_uuid ()
                
        let wishes = []

        if (this.img) {
            this.is_illustrated = 1
            this.ext = this.ext || 'png'
            wishes.push (this.store_image (path))
        }
        
        wishes.unshift (db.insert ('task_notes', this))

        return Promise.all (wishes)

    }
    
    async send_mail (db, conf) {

        if (!conf.port) {
            conf.port = 25
            conf.secure = false
        }
        
        let from = conf.from
        from.name = from.label

        let transporter = nodemailer.createTransport (conf, {from: from})

        let to = await db.get ([{users: {id: this.id_user_to}}])

        transporter.sendMail ({
            to: await db.get ([{'users(label AS name, mail AS address)': {id: this.id_user_to}}]),
            text: `${this.label}
            ${this.body}
            `
        }, darn)                
        
    }

    async store_and_get_id (db, path, mail) {

        let result = await this.store (db, path)

        setImmediate (() => this.send_mail (db, mail))

        return result [0]

    }

}

module.exports = {

////////////////
  do_comment: //
////////////////

    async function () {        
    
        let note = new Note (this.q.data)
        
        await note.fetch_id_task (this.db, this.q.id)
        
        return note.store_and_get_id (this.db, this.conf.pics, this.conf.mail)

    },
    
///////////////
  do_create: //
///////////////

    async function () {        
    
        let note = new Note (this.q.data)        
        
        note.id_user_to = this.user.id
        
        note.id_task = await this.db.insert ('tasks', {
            fake: 0,
            id_user: this.user.id,
            label: this.q.data.label,
        })
        
        let id_task_note = note.store_and_get_id (this.db, this.conf.pics, this.conf.mail)
        
        await this.db.insert ('task_users', [0, 1].map ((i) => {return {
            fake       : 0,
            id_task    : note.id_task,
            id_user    : this.user.id,
            is_author  : i,
        }}))
        
        return this.db.get ([{tasks: {id: note.id_task}}])
            
    },    
    
///////////////
  do_assign: //
///////////////

    async function () {
    
        let note = new Note (this.q.data)        
        
        if (!note.id_user_to) throw '#id_user_to#:Не указан адресат'
        
        await note.fetch_id_task (this.db, this.q.id)
        
        return Promise.all ([        
            this.db.do ('UPDATE task_users SET id_user = ?    WHERE id_task = ? AND is_author = 0', [note.id_user_to, note.id_task]),
            this.db.do ('UPDATE task_notes SET id_user_to = ? WHERE id_task = ?', [note.id_user_to, note.id_task]),
            note.store_and_get_id (this.db, this.conf.pics, this.conf.mail)
        ])

    },

////////////
  select: //
////////////

    function () {
    
        this.q.sort = [{field: "id", direction: "asc"}]
        
        let x = {}
        
        if (this.q.searchLogic == 'OR') {
            x.note = this.q.search [0].value
            this.q.search = []
        }
        else if (this.q.searchLogic == 'AND') {            

            let r = []

            for (let s of this.q.search) switch (s.field) {
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
            
            this.q.search = r
        
        }
        
        let filter = this.w2ui_filter ()
        
        if (x.status != undefined) filter ['id_user ' + (x.status ? '<>' : '=')] = null

        if (x.note != undefined) filter.id = this.db.query ([{'task_notes(id_task)': {'label ILIKE %?% OR body ILIKE %?%': [x.note, x.note]}}]) 

        if (x.id_other_user) filter ['id IN'] = this.db.query ([{'task_users(id_task)': {
            id_user   : x.id_other_user.map ((i) => i.id),
            is_author : x.is_author,
        }}])

        return this.db.add_all_cnt ({}, [
            {tasks : filter}, 
            'task_notes ON id_last_task_note',
        ])

    },

//////////////
  get_vocs: //
//////////////

    function () {

        return this.db.add_vocabularies ({}, {
            users: {filter: 'id > 0'}
        })

    },

/////////
  get: //
/////////

    async function () {

        let data = await this.db.get ([{tasks: {uuid: this.q.id}}])

        data.users = Object.values (await this.db.fold ([{task_users: {id_task: data.id}}, '$users'], (i, idx) => {

            let user = {id: i ['users.id'], label: i ['users.label']}

            data [i.is_author ? 'author' : 'executor'] = user

            idx [user.id] = user

        }, {})).sort ((a, b) => a > b)   

        await this.db.add (data, {
        
            task_notes: {
                id_task: data.id,
                ORDER:   'id',
            }
            
        })

        data.peers = await this.db.list ([

            {users: {
                'id >'  : 0,
                'id <>' : this.user.id,
            }},
            {'$user_users ON user_users.id_user_ref = users.id' : {
                id_user : this.user.id,
                is_on   : 1,
            }}

        ])    

        return data

    }

}