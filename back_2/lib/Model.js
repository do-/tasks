const {DbModel} = require ('doix-db')

module.exports = class extends DbModel {

    constructor (db) {

        super ({
			db,
			src: [{root: [__dirname], filter: (_, arr) => arr.at (-1) === 'Model'}],
		})
		
		this.loadModules ()

	}
	
	getFields (relationName) {

		const o = {}, {columns} = this.find (relationName)
		
		for (const {name, type, comment} of Object.values (columns)) o [name] = {
			name, 
			"REMARK": comment, 
			"TYPE_NAME": type,
		}
			
		return o

	}

}