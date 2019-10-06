const nodemailer = require ('nodemailer')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_task_notes: 

    async function () {
darn (this.rq)
		let data = this.rq.data
		
        if (data.id_user_to <= 0) data.id_user_to = null
        
        data.label = (data.label || '').trim ()
        
        if (data.body == null) {
            let lines  = data.label.split (/[\n\r]+/)
            data.label = lines.shift ()
            data.body  = lines.join ("\n")
        }
        
        let todo = []
                
        if (data.img) {
            data.is_illustrated = 1
            data.ext  = this.ext || 'png'
            let [yyyy, mm, dd]  = new Date ().toJSON ().substr (0, 10).split ('-')
            data.path = `/${yyyy}/${mm}/${dd}/${data.uuid}.${data.ext}`
        }

        todo.push (this.db.insert ('task_notes', data))

		await Promise.all (todo)

    },

////////////////////////////////////////////////////////////////////////////////

notify: 

    async function () {

        let data = await this.db.get ([
            {task_notes: {uuid: this.rq.id}},
            'users(label, mail) ON id_user_to',
        ])
        
        if (data.id_user_from == data.id_user_to) return

        let msg = {
        
            to: {
                name:    data ['users.label'],
                address: data ['users.mail'],
            },
        
            subject: data.label,
        
            text: `${data.body}\n\n${this.rq.uri}\n`

        }
        
        if (data.ext) msg.attachments = [{path: `${this.conf.pics}${data.path}`}]

        this.mail.sendMail (msg, darn)

    },

////////////////////////////////////////////////////////////////////////////////

notify_assign: 

    async function () {

        let data = await this.db.get ([
            {task_notes: {uuid: this.rq.id}},
            'users(label, mail) ON id_user_to',
        ])

        let msg = {        
            to: {
                name:    data ['users.label'],
                address: data ['users.mail'],
            },        
            text: '',            
            attachments: [],
        }

        let notes = await this.db.select_all ('SELECT * FROM task_notes WHERE id_task = ? ORDER BY ts', [data.id_task])

        for (let note of notes) {

            if (msg.subject) {
                msg.text += `\n${note.label}\n${note.body}`
            }
            else {
                msg.subject = note.label
                msg.text += `\n${note.body}`
            }

            if (note.ext) msg.attachments.push ({path: `${this.conf.pics}${note.path}`})

        }
        
        msg.text += `\n\n${this.rq.uri}\n`

        this.mail.sendMail (msg, darn)

    },

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_task_notes: 

    function () {

        return this.db.add_vocabularies ({}, {
            users: {filter: 'login IS NOT NULL'}
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_task_notes: 

    function () {
        
        let label
        let note

        let r = []
        let task_filter = {}

        for (let s of this.rq.search) switch (darn(s).field) {
            case 'q':
                note = s.value
                break
            case 'tasks.label':
                task_filter ['label ILIKE %?%'] = s.value
                break
            case 'status':
                task_filter ['id_user' + (s.value == 1 ? '<>' : '=')] = null
                break
            default:
                r.push (s)
        }

        this.rq.search = r
        
        this.rq.sort = [{field: "ts", direction: "desc"}];

        let filter = this.w2ui_filter ()
        
        if (note) filter ['label ILIKE %?% OR body ILIKE %?%'] = [note, note]
                    
        return this.db.add_all_cnt ({}, [
            {task_notes: filter}, 
            {'$tasks(uuid, label) ON task_notes.id_task': task_filter}
        ])
        
    },

////////////////////////////////////////////////////////////////////////////////
    
}
