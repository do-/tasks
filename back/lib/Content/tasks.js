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
                id_voc_project:   this.rq.data.id_voc_project,
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

    async function () {
        
        let where = 'true', params = [], limit, offset
        
        for (const [k, v] of Object.entries (this.dx_filter ())) switch (k) {
        
        	case 'LIMIT':
        		[limit, offset] = v

        	case 'ORDER':
        		break

        	default:
        		where  = k.replace (/\bnote.*?\?/,
        			`uuid IN (
        				WITH t AS (SELECT CONCAT ('%', ?::text, '%') AS mask)
        				SELECT
        					n.id_task
        				FROM
        					t
        					JOIN task_notes n ON (n.txt ILIKE t.mask)
        			)`
        		)
        		params = v

        }

        const [tasks, cnt] = await this.db.select_all_cnt ('SELECT * FROM vw_tasks WHERE ' + where + ' ORDER BY ts', params, limit, offset = 0)
        
        return {tasks, cnt, portion: limit}

    },

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_tasks: 

    function () {

        return this.db.add_vocabularies ({}, {
            users: {filter: 'uuid IN (SELECT DISTINCT id_user FROM task_users)'},
            voc_task_status: {},
            voc_projects: {},
        })

    },

////////////////////////////////////////////////////////////////////////////////

get_item_of_tasks: 

    async function () {
    
        return Promise.all ([

            this.db.get  ([{vw_tasks:   {uuid:       this.rq.id}}]),

            this.db.list ([{task_notes: {id_task:    this.rq.id, ORDER: 'ts'}}]),

			this.db.select_all (`

						SELECT
							0 AS lvl
							, ts::text AS ord
							, vw_tasks.*
						FROM
							task_tasks
							INNER JOIN vw_tasks ON task_tasks.id_task = vw_tasks.uuid
						WHERE
							task_tasks.id_task_to = ?
						ORDER BY
							ts

			`, [this.rq.id]),

            this.db.list ([{task_tasks: {id_task:    this.rq.id, ORDER: 'vw_tasks.ts'}},
                'vw_tasks ON id_task_to',
            ]),
            
            this.db.select_vocabulary ('voc_projects'),

        ])

        return data

    }

}