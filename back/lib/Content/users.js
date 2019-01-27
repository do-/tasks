const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////
  select: //
////////////

    function () {
   
        this.q.sort = this.q.sort || [{field: "label", direction: "asc"}]

        if (this.q.searchLogic == 'OR') {

            let q = this.q.search [0].value

            this.q.search = [
                {field: 'label', operator: 'contains', value: q},
                {field: 'login', operator: 'contains', value: q},
                {field: 'mail',  operator: 'contains', value: q},
            ]

        }
    
        let filter = this.w2ui_filter ()
        filter ['uuid <>'] = '00000000-0000-0000-0000-000000000000'

        return this.db.add_all_cnt ({}, [{users: filter}, 'roles AS role'])

    },

/////////
  get: //
/////////

    function () {
        
        return this.db.get ([{users: 

            {uuid: this.q.id},

        }, 'roles AS role'])

    },
    
/////////////////
  get_options: //
/////////////////

    async function () {
    
        let user = await this.db.get ([{users: {uuid: this.q.id}}, 'roles'])
        
        let filter = {'roles... LIKE': `% ${user['roles.name']} %`}
        
        return this.db.add ({}, [
        
            {voc_user_options: filter},
            
            {'user_options(is_on)': {
                fake: 0,
                id_user: user.id,
            }}

        ])

    },
    
///////////////////
  do_set_option: //
///////////////////
    
    async function () {
    
        if (this.user.role != 'admin') throw '#foo#:Доступ запрещён'

        let d = {
            fake: 0,
            id_user: await this.db.get ({'users(id)': {uuid: this.q.id}})
        }
        
        for (let k of ['is_on', 'id_voc_user_option']) d [k] = this.q.data [k]
        
        return this.db.upsert ('user_options', d, ['id_user', 'id_voc_user_option'])
        
    },

///////////////////////
  do_set_own_option: //
///////////////////////

    async function () {

        let voc_user_option = this.db.get ([{voc_user_options: {id: this.q.data.id_voc_user_option}}]);

        if (!voc_user_option.is_own) throw '#foo#:Доступ запрещён'

        let d = {
            fake: 0,
            id_user: this.user.id
        }

        for (let k of ['is_on', 'id_voc_user_option']) d [k] = this.q.data [k]

        return this.db.upsert ('user_options', d, ['id_user', 'id_voc_user_option'])

    },
    
/////////////////////
  get_own_options: //
/////////////////////

    async function () {

        let filter = this.w2ui_filter ()

        filter ['roles... LIKE'] = "% $_USER->{role}->{name} %"
        filter.is_own = 1
        
        return this.db.add ({}, [{voc_user_options: filter},
            {'user_options(is_on)': {
                fake: 0,
                id_user: this.user.id,
            }}
        ])

    },
    
///////////////
  get_peers: //
///////////////

    async function () {
        
        return this.db.add ({}, [
            {users: {
                'id > ': 0,
                'id <> ': this.user.id,                
            }},
            {'user_users AS user_user ON user_user.id_user_ref = users.id': {
                is_on: 1,
                id_user: this.user.id,
            }}
        ])

    },
    
//////////////////
  do_set_peers: //
//////////////////

    async function () {
        
        await this.db.do ('UPDATE user_users SET is_on = 0 WHERE id_user = ?', [this.user.id])

        await this.db.upsert ('user_users', this.q.data.ids.map ((i) => {return {
            fake               : 0,
            is_on              : 1,
            id_user            : this.user.id,
            id_user_ref        : i,            
        }}), ['id_user', 'id_user_ref'])

    },
        
    
/////////////////////
  do_set_password: //
/////////////////////

    async function () {

        if (this.q.p1 == undefined) throw '#p1#: Получено пустое значение пароля'
        if (this.q.p1 != this.q.p2) throw '#p2#: Повторное значение пароля не сходится'

        let uuid = 
                   this.user.role == 'admin' ? this.q.id : 
                   this.user.uuid

        let salt     = await this.session.password_hash (Math.random (), new Date ().toJSON ())
        let password = await this.session.password_hash (salt, this.q.p1)

        return this.db.update ('users', {uuid, salt, password}, ['uuid'])

    },

///////////////
  do_update: //
///////////////

    async function () {
    
        let data = this.q.data
            
        if (!/^[А-ЯЁ][А-ЯЁа-яё\- ]+[а-яё]$/.test (data.label)) throw '#label#: Проверьте, пожалуйста, правильность заполнения ФИО'

        if (!/^[A-Za-z0-9_\.]+$/.test (data.login)) throw '#login#: Недопустимый login'
        
        let uuid = this.q.id

        let d = {uuid}

        for (let k of ['login', 'label', 'mail']) d [k] = data [k]
        
        try {
            await this.db.update ('users', d, ['uuid'])
        }
        catch (x) {
            throw x.constraint == 'ix_users_login' ? '#login#: Этот login уже занят' : x
        }

    },

///////////////
  do_create: //
///////////////

    async function () {
    
        let data = this.q.data
            
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