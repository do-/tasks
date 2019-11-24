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
/*
            this.db.list ([{task_tasks: {id_task_to: this.rq.id, ORDER: 'vw_tasks.ts'}},
                'vw_tasks ON id_task',
            ]),
*/

			this.db.select_all (`

				WITH RECURSIVE r AS (

						SELECT
							0 AS lvl
							, ts::text AS ord
							, vw_tasks.*
						FROM
							task_tasks
							INNER JOIN vw_tasks ON task_tasks.id_task = vw_tasks.uuid
						WHERE
							task_tasks.id_task_to = ?

					UNION ALL

						SELECT
							1 + r.lvl AS lvl
							, r.ord || vw_tasks.ts::text AS ord
							, vw_tasks.*
						FROM
							r
							INNER JOIN task_tasks ON task_tasks.id_task_to = r.uuid
							INNER JOIN vw_tasks ON task_tasks.id_task = vw_tasks.uuid


				) SELECT * FROM r ORDER BY ord

			`, [this.rq.id]),

            this.db.list ([{task_tasks: {id_task:    this.rq.id, ORDER: 'vw_tasks.ts'}},
                'vw_tasks ON id_task_to',
            ]),

        ])

        return data

    }

////////////////////////////////////////////////////////////////////////////////

}