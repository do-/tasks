const Session       = require ('../../Ext/Dia/Content/Handler/HTTP/Session/JWTCookieSession.js')
const DiaW2uiFilter = require ('../../Ext/Dia/Content/Handler/HTTP/Ext/w2ui/Filter.js')

module.exports = class extends require ('../../Ext/Dia/Content/Handler/HTTP.js').Handler {

    constructor (o) {
    	super (o)
    	this.import ((require ('./Base')), ['get_method_name', 'fork'])
    }

    check () {
        super.check ()
        let m = this.http.request.method
        if (m != 'POST') throw '405 No ' + m + 's please'
    }
    
    check_params () {
        super.check_params ()
        let h = this.http.request.headers
        let rq = this.rq
        this.uri = `${h.scheme}://${h.host}/${rq.type}/`
        if (rq.id) this.uri += rq.id
    }
    
    get_method_name () {
        let rq = this.rq
        if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
        if (rq.action) return 'do_'  + rq.action + '_' + rq.type
        return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }
    
    is_anonymous () {
        let rq = this.rq
        return rq.type == 'sessions' && rq.action == 'create'
    }
    
    get_session () {
    	return new Session (this, this.conf.auth.sessions)
    }
    
    async get_user () {
        let user = await super.get_user ()
        if (!this.is_transactional () || !user) return user
        await this.db.do ("SELECT set_config ('tasks.id_user', ?, true)", [user.uuid])
        return user
    }

    w2ui_filter () {return new DiaW2uiFilter (this.rq)}

    async password_hash (salt, password) { 
		return this.pwd_calc.encrypt (password, salt)
    }

}