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
    
        // $_USER -> {role} eq 'admin' or die '#foo#:Доступ запрещён';

        let d = {
            fake: 0,
            id_user: await this.db.get ({'users(id)': {uuid: this.q.id}})
        }
        
        for (let k of ['is_on', 'id_voc_user_option']) d [k] = this.q.data [k]
        
        return this.db.upsert ('user_options', d, ['id_user', 'id_voc_user_option'])
        
    },

}