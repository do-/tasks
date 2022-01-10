const nodemailer = require ('nodemailer')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_task_notes: 

    async function () {

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
            
            let [yyyy, mm, dd] = new Date ().toJSON ().substr (0, 10).split ('-'); data.path = `/${yyyy}/${mm}/${dd}/${data.uuid}.${data.ext}`
	        
	        todo.push (this.fork ({type: 'task_note_images', id: data.uuid}, data))

        }

        todo.push (this.db.insert ('task_notes', data))

		await Promise.all (todo)
		
		if (data.id_user_to == null) return
		if (data.id_user_to == this.user.uuid) return
		
		let filter = data.is_assigning ? {id_task: data.id_task, ORDER: 'ts'} : {uuid: data.uuid}

		let notes = await this.db.list ([
            {task_notes: filter},
            'users(label, mail) ON id_user_to',
        ])
        
        this.fork ({action: 'notify_on'}, {notes})

    },

////////////////////////////////////////////////////////////////////////////////

do_notify_on_task_notes:

    async function () {

        let notes = this.rq.notes
        
        let data = notes [notes.length - 1]

        let msg = {        
            to: {
                name:    data ['users.label'],
                address: data ['users.mail'],
            },        
            text: '',            
            attachments: [],
        }

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
        
        msg.text += `\n\n${this.uri}\n`

        this.mail.sendMail (msg, darn)

    },

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_task_notes: 

    function () {

        return this.db.add_vocabularies ({}, {
            voc_projects: {},
            users: {filter: 'login IS NOT NULL'}
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_task_notes: 

    function () {

        let task_filter = {}

		this.rq.loadOptions.sort = [{selector: 'ts', desc: true}]
        
        let filter = this.dx_filter ()
                    
        return this.db.add_all_cnt ({}, [
            {'vw_task_notes AS task_notes': filter},
        ])
        
    },

////////////////////////////////////////////////////////////////////////////////
    
}
