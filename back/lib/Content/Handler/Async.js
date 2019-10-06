const Async = require ('../../Ext/Dia/Content/Handler/Async.js')

module.exports = class extends Async.Handler {

    constructor (o, resolve, reject) {
    	super (o, resolve, reject)
    	this.import ((require ('./Base')), ['get_method_name', 'fork'])
    }
    
    async get_user () {
    	let user = this.user // must be injected 
        await this.db.do ("SELECT set_config ('tasks.id_user', ?, true)", [user.uuid])
        return user
    }

}