module.exports = class {

    get_method_name () {
		let rq = this.rq
		if (rq.part)   return 'get_' + rq.part + '_of_' + rq.type
		if (rq.action) return 'do_'  + rq.action + '_' + rq.type
		return (rq.id ? 'get_item_of_' : 'select_') + rq.type
    }
    	
	async fork (tia, data) {

		let user = this.user
		let conf = this.conf

		let rq = {}

		if (data) for (let k in data) rq [k] = data [k]

		for (let k of ['type', 'id', 'action']) rq [k] = tia [k] || this.rq [k]

		let o = {user, conf, rq, pools: [], base_uri: this.base_uri}
			
		for (let k in conf.pools) o [k]	= this [k]

		let b = this.get_log_banner ()		

		return new Promise (function (resolve, reject) {

			let h = new (require ('./Async')) (o, resolve, reject)

			darn (b + ' -> ' + h.get_log_banner ())

			setImmediate (() => h.run ())        

		})

	}

}