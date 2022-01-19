const nodemailer = require ('nodemailer')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_task_notes: 

    async function () {

		let data = this.rq.data
		
        if (data.id_user_to <= 0) data.id_user_to = null
        
        let todo = []

		if (data.body != null) {

			const RE = /(src="data:image\/png;base64,.*?")/
			
			let html = '', cnt = 0; for (let part of data.body.split (RE)) {
			
				if (RE.test (part)) {
				
					const pos = part.indexOf (',')
					
					const id = this.uuid + '_' + (cnt ++)
					
					const path = await this.f_s.new_path (id, '1.png')
					
					await this.f_s.append (path, part.slice (pos + 1, -1), 'base64')
					
					part = `src="/_pics/${path}"`
					
				}
				
				html += part
			
			}
			
			data.body = html
		
		}

        todo.push (this.db.insert ('task_notes', {...data, is_html: true}))

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
