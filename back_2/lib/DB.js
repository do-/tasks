const {DbPoolPg} = require ('doix-db-postgresql')
const w2ui       = require ('doix-w2ui')
const Model      = require ('./Model.js')

module.exports = class extends DbPoolPg {

	constructor (db, logger) {

		super ({db, logger})

		w2ui.plugInto (this)

		new Model (this)

		this.shared.add ('updateModel')

	}

	async updateModel () {

		const {job, pool} = this

		await pool.toSet (job, 'db')

        const {db} = job, plan = db.createMigrationPlan ()

        await plan.loadStructure ()

        plan.inspectStructure ()

    	for (const [sql, params] of plan.genDDL ()) await db.do (sql, params)

	}

}