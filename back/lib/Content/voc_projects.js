const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_voc_projects: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.voc_projects.columns}, {
        })

    },

////////////////////////////////////////////////////////////////////////////////

select_voc_projects: 
    
    function () {
   
        this.rq.sort = this.rq.sort || [{field: "label", direction: "asc"}]

        let filter = this.w2ui_filter ()
        
        for (let k in filter) if (/^q /.test (k)) {
            let v = filter [k]
            delete filter [k]
            const fields = ['label']
            filter [`(${fields.map ((f) => f + ' ILIKE %?%').join (' OR ')})`] = fields.map (() => v)
        }

        return this.db.add_all_cnt ({}, [{voc_projects: filter}])

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_voc_projects: 

    async function () {
        
        let data = await this.db.get ([{voc_projects: 

            {uuid: this.rq.id},

        }])
        
        data._fields = this.db.model.tables.voc_projects.columns
        
        return data

    },
       
////////////////////////////////////////////////////////////////////////////////

do_undelete_voc_projects: 

    async function () {
    
        this.db.update ('voc_projects', {
            uuid        : this.rq.id, 
            is_deleted  : 0, 
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

do_delete_voc_projects: 

    async function () {

        return Promise.all ([
        
//        	this.db.do ('DELETE FROM user_voc_projects WHERE id_user_ref = ?', [this.rq.id]),

            this.db.update ('voc_projects', {
                uuid        : this.rq.id, 
                is_deleted  : 1, 
            }),

        ])

    },

////////////////////////////////////////////////////////////////////////////////

do_update_voc_projects: 

    async function () {
    
        let data = this.rq.data
                    
        let uuid = this.rq.id

        let d = {uuid}

        for (let k of ['label']) d [k] = data [k]

        return this.db.update ('voc_projects', d)

    },

////////////////////////////////////////////////////////////////////////////////

do_create_voc_projects:

    async function () {
    
        let data = this.rq.data
            
        let d = {uuid: this.rq.id}

        for (let k of ['label']) d [k] = data [k]        
        
		await this.db.insert ('voc_projects', d)
        
        return d

    },

}