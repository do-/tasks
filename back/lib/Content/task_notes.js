const nodemailer = require ('nodemailer')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

notify: 

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
        
            subject: data.label,
        
            text: `${data.body}\n\n${this.rq.uri}`

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
                task_filter ['id_user' + (s.value == 1 ? '=' : '<>')] = null
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
