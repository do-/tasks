const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

select_users: 
    
    function () {
   
        this.rq.sort = this.rq.sort || [{field: "label", direction: "asc"}]

        if (this.rq.searchLogic == 'OR') {

            let q = this.rq.search [0].value

            this.rq.search = [
                {field: 'label', operator: 'contains', value: q},
                {field: 'login', operator: 'contains', value: q},
                {field: 'mail',  operator: 'contains', value: q},
            ]

        }
    
        let filter = this.w2ui_filter ()
        
        filter ['uuid <>'] = '00000000-0000-0000-0000-000000000000'
        filter.is_deleted  = 0

        return this.db.add_all_cnt ({}, [{users: filter}, 'roles AS role'])

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_users: 

    function () {
        
        return this.db.get ([{users: 

            {uuid: this.rq.id},

        }, 'roles AS role'])

    },
    
////////////////////////////////////////////////////////////////////////////////

get_options_of_users: 

    async function () {
    
        let user = await this.db.get ([{users: {uuid: this.rq.id}}, 'roles'])
        
        let filter = {'roles... LIKE': `% ${user['roles.name']} %`}
        
        return this.db.add ({}, [
        
            {voc_user_options: filter},
            
            {'user_options(is_on)': {
                id_user: user.uuid,
            }}

        ])

    },
    
////////////////////////////////////////////////////////////////////////////////

do_set_option_users: 

    async function () {
    
        if (this.user.role != 'admin') throw '#foo#:Доступ запрещён'

        let d = {
            id_user: this.rq.id
        }
        
        for (let k of ['is_on', 'id_voc_user_option']) d [k] = this.rq.data [k]
        
        return this.db.upsert ('user_options', d, ['id_user', 'id_voc_user_option'])
        
    },

////////////////////////////////////////////////////////////////////////////////

do_set_own_option_users: 

    async function () {

        let voc_user_option = this.db.get ([{voc_user_options: {id: this.rq.data.id_voc_user_option}}]);

        if (!voc_user_option.is_own) throw '#foo#:Доступ запрещён'

        let d = {
            id_user: this.user.id
        }

        for (let k of ['is_on', 'id_voc_user_option']) d [k] = this.rq.data [k]

        return this.db.upsert ('user_options', d, ['id_user', 'id_voc_user_option'])

    },
    
////////////////////////////////////////////////////////////////////////////////

get_own_options_of_users: 

    async function () {

        let filter = this.w2ui_filter ()
        delete filter.LIMIT
        filter ['roles... LIKE'] = `% ${this.user.role} %`
        filter.is_own = 1
        
        return await this.db.add ({}, [{voc_user_options: filter},
            {'user_options(is_on)': {
                id_user: this.user.uuid,
            }}
        ])

    },
    
////////////////////////////////////////////////////////////////////////////////

get_peers_of_users: 
      
    async function () {
        
        return this.db.add ({}, [
            {users: {
                'login <>' : null,
                'uuid  <>' : this.user.uuid,
                is_deleted : 0,
                ORDER      : 'label',
            }},
            {'user_users AS user_user ON user_user.id_user_ref = users.uuid': {
                is_on: 1,
                id_user: this.user.uuid,
            }}
        ])

    },
    
////////////////////////////////////////////////////////////////////////////////

do_set_peers_users:
  
    async function () {
        
        await this.db.do ('UPDATE user_users SET is_on = 0 WHERE id_user = ?', [this.user.uuid])

        await this.db.upsert ('user_users', this.rq.data.ids.map ((i) => {return {
            is_on              : 1,
            id_user            : this.user.uuid,
            id_user_ref        : i,            
        }}), ['id_user', 'id_user_ref'])

    },
        
////////////////////////////////////////////////////////////////////////////////

do_set_password_users: 

    async function () {

        if (this.rq.p1 == undefined) throw '#p1#: Получено пустое значение пароля'
        if (this.rq.p1 != this.rq.p2) throw '#p2#: Повторное значение пароля не сходится'

        let uuid = 
                   this.user.role == 'admin' ? this.rq.id : 
                   this.user.uuid

        let salt     = await this.session.password_hash (Math.random (), new Date ().toJSON ())
        let password = await this.session.password_hash (salt, this.rq.p1)

        return this.db.update ('users', {uuid, salt, password})

    },

////////////////////////////////////////////////////////////////////////////////

do_delete_users: 

    async function () {
    
        return Promise.all ([

            this.db.update ('user_users', {
                id_user_ref : this.rq.id,
                is_on       : 0,
            }, ['id_user_ref']),

            this.db.update ('users', {
                uuid        : this.rq.id, 
                is_deleted  : 1, 
            }),

        ])

    },

////////////////////////////////////////////////////////////////////////////////

do_update_users: 

    async function () {
    
        let data = this.rq.data
            
        if (!/^[А-ЯЁ][А-ЯЁа-яё\- ]+[а-яё]$/.test (data.label)) throw '#label#: Проверьте, пожалуйста, правильность заполнения ФИО'

        if (!/^[A-Za-z0-9_\.]+$/.test (data.login)) throw '#login#: Недопустимый login'
        
        let uuid = this.rq.id

        let d = {uuid}

        for (let k of ['login', 'label', 'mail']) d [k] = data [k]
        
        try {
            await this.db.update ('users', d)
        }
        catch (x) {
            throw x.constraint == 'ix_users_login' ? '#login#: Этот login уже занят' : x
        }

    },

////////////////////////////////////////////////////////////////////////////////

do_create_users:

    async function () {
    
        let data = this.rq.data
            
        if (!data.id_role) throw '#id_role#: Не указана роль'

        if (!/^[А-ЯЁ][А-ЯЁа-яё\- ]+[а-яё]$/.test (data.label)) throw '#label#: Проверьте, пожалуйста, правильность заполнения ФИО'

        if (!/^[A-Za-z0-9_\.]+$/.test (data.login)) throw '#login#: Недопустимый login'

        let d = {}

        for (let k of ['login', 'label', 'id_role']) d [k] = data [k]        
        
        try {
            d.uuid = await this.db.insert ('users', d)
        }
        catch (x) {
            throw x.constraint == 'ix_users_login' ? '#login#: Этот login уже занят' : x
        }
        
        return d

    },

}