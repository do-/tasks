const { error } = require("winston")

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_users: 

    async function () {
//console.log (this)

throw Error ('OK')
    	const {db: {model}, rq: {type}} = this

		const data = {		
			_fields: model.getFields (type),				
		}
		
		for (const k of ['roles']) data [k] = model.find (k).data

        return data

    },
    
}