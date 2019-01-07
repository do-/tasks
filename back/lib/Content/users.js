const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////
  select: //
////////////

    function () {

        return this.db.add ({}, [{users: {'id >': 0}}, 'roles AS role'])

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
        
        if (await this.db.get ([{'users(uuid)': {
            login     : data.login,
            fake      : 0,
            'uuid <>' : uuid
        }}])) throw '#login#: Этот login уже занят'
        
        let d = {uuid}

        for (let k of ['login', 'label', 'mail']) d [k] = data [k]

        return this.db.update ('users', d, ['uuid'])

    }

}