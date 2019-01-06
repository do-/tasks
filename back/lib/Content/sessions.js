module.exports = {

////////////
  create: //
////////////  

    async function () {
    
        let user = await this.db.get (users: {
            login: this.q.data.login,
            fake : 0,
        }, 'roles(name)')
        
        if (!user.id) return {}
        
        this.session.user = user
        await this.session.start ()
        
        return {user, timeout: 30}

    }
    
////////////
  delete: //
////////////  

    function () {
        return this.session.finish ()
    }


}