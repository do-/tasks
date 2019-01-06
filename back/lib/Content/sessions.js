module.exports = {

///////////////
  do_create: //
///////////////  

    async function () {
    
        let user = await this.db.get ([{users: {
            login: this.q.data.login,
            fake : 0,
        }}, 'roles(name)'])
        
        if (!user.id) return {}
        
        this.session.user = user
        await this.session.start ()
        
        user.role = user ['roles.name']
        let data = {user, timeout: 30}

        return data

    },
    
///////////////
  do_delete: //
///////////////  

    function () {
        return this.session.finish ()
    },

}