module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_init_app: 

    async function () {

        await this.db.pool.toSet (this, 'db')
    
    	const {db} = this

        const plan = db.createMigrationPlan ()

        await plan.loadStructure ()

        plan.inspectStructure ()

    	for (const [sql, params] of plan.genDDL ()) await db.do (sql, params)

    },
    
}