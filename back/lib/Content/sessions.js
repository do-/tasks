module.exports = {

///////////////
  do_create: //
///////////////  

    async function () {
    
        let user = await this.db.get ([{users: {
            login: this.q.data.login,
            fake : 0,
        }}, 'roles(name)'])
                
        if (user.id) {
            if (user.password != await this.session.password_hash (user.salt, this.q.password)) return {}
        }
        else if (this.conf.auth.allow_test_admin && this.q.data.login == 'test' && this.q.password == 'test') {
            user = await this.db.get ([{users: {uuid: '00000000-0000-0000-0000-000000000000'}}, 'roles(name)'])
        }
        else {
            return {}
        }

        this.session.user = user
        await this.session.start ()
        
        user.role = user ['roles.name']
        
        user.opt = await this.db.fold ([

            {'user_options()': {
                fake: 0,
                is_on: 1,
                id_user: user.uuid
            }},

            'voc_user_options(name)'

        ], (i, d) => {d [i ['voc_user_options.name']] = 1}, {})

        return {user, timeout: this.session.o.timeout}

    },
    
///////////////
  do_delete: //
///////////////  

    function () {
        return this.session.finish ()
    },

}