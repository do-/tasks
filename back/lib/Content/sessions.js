module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_sessions: 

    async function () {
    
        let user = await this.db.get ([{users: {
            login: this.rq.data.login,
        }}, 'roles(name)'])
        
        if (user.is_deleted) throw '#foo#: Вас пускать не велено'
                
        if (user.uuid) {
            if (user.password != await this.password_hash (user.salt, this.rq.password)) return {}
        }
        else if (this.conf.auth.allow_test_admin && this.rq.data.login == 'test' && this.rq.password == 'test') {
            user = await this.db.get ([{users: {uuid: '00000000-0000-0000-0000-000000000000'}}, 'roles(name)'])
        }
        else {
            return {}
        }

        this.session.user = user
        await this.session.start ()
        
        user.role = user ['roles.name']
        user.id = user.uuid
        
        user.opt = await this.db.fold ([

            {'user_options()': {
                is_on: 1,
                id_user: user.uuid
            }},

            'voc_user_options(name)'

        ], (i, d) => {d [i ['voc_user_options.name']] = 1}, {})

        user.peers = await this.db.list ([

            {'users(uuid, label, uuid AS id)': {
                'login<>' : null,
                'uuid <>' : user.uuid,
            }},
            {'$user_users ON user_users.id_user_ref = users.uuid' : {
                id_user : user.uuid,
                is_on   : 1,
            }}

        ])    

        return {user, timeout: this.session.o.timeout}

    },
    
////////////////////////////////////////////////////////////////////////////////

do_delete_sessions: 

    function () {
    
        return this.session.finish ()
    
    },
    
////////////////////////////////////////////////////////////////////////////////

}