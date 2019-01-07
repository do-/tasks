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
        else if ($_CONF.auth.allow_test_admin && this.q.data.login == 'test' && this.q.password == 'test') {
            user = await this.db.get ([{users: {id : -1}}, 'roles(name)'])
        }
        else {
            return {}
        }

        this.session.user = user
        await this.session.start ()
        
        user.role = user ['roles.name']
        let data = {user, timeout: this.session.o.timeout}

        return data

    },
    
///////////////
  do_delete: //
///////////////  

    function () {
        return this.session.finish ()
    },

}