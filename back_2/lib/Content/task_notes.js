module.exports = {
/*
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
            html: `<html><head><base href="${this.base_uri}"></head><body>`,            
        }

        for (let note of notes) {

            if (msg.subject) {
                msg.html += `<h1>${note.label}</h2>${note.body}`
            }
            else {
                msg.subject = note.label
                msg.html += note.body
            }
            
        }

        msg.html += `<br><br><small><a href="/tasks/${data.id_task}">${this.uuid}</a></small></body>`

        this.mail.sendMail (msg, darn)

    },
*/
////////////////////////////////////////////////////////////////////////////////

get_vocs_of_task_notes:

    function () {

		const {db} = this, SELECT_FROM = "SELECT JSONB_AGG (JSONB_BUILD_OBJECT ('id', uuid, 'label', label) ORDER BY label) FROM"

        return db.getScalar (/*sql*/`
            SELECT JSONB_BUILD_OBJECT (
                'users',        (${SELECT_FROM} users WHERE label IS NOT NULL),
                'voc_projects', (${SELECT_FROM} voc_projects)
            )
        `)

    },

////////////////////////////////////////////////////////////////////////////////

select_task_notes:

    function () {

    	const {db} = this

		const q = db.dxQuery ([['vw_task_notes', {as: 'task_notes'}]])

        q.order = []; q.orderBy ('ts', true)

        return db.getArray (q)

    },

}