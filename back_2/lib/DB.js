const {DbPoolPg} = require ('doix-db-postgresql')
const w2ui       = require ('doix-w2ui')
const Model      = require ('./Model.js')

module.exports = class extends DbPoolPg {

	constructor (db, logger) {

		super ({db, logger})

		this.noModelUpdate = !!db.noModelUpdate

		w2ui.plugInto (this)

		new Model (this)

		this.shared.add ('updateModel')

	}

	async updateModel () {

		if (this.pool.noModelUpdate) return

		const {job, pool} = this

		await pool.toSet (job, 'db')

        const {db} = job, plan = db.createMigrationPlan ()

        await plan.loadStructure ()

        plan.inspectStructure ()

    	for (const [sql, params] of plan.genDDL ()) await db.do (sql, params)

	}

}