const {DbChannelPg} = require ('doix-db-postgresql')

const FIELD_NAME = 'payload'

module.exports = class extends DbChannelPg {

    constructor (app, o) {

        super (app, o)

        if (o.autoStart !== false) this.autoStart = true

        const self = this

        this.addHandler ('start', function () {

            this.waitFor (self.onJobStart (this))

        })

    }

    async onJobStart (job) {

        const queueName = job.notification [FIELD_NAME]

        const q = this.db.model.find (queueName); if (!q) this.fail (`Queue '${queueName}' not found`)

        const {queue} = q; if (!queue) this.fail (`'${queueName}' is not a queue`)

        const sql = `SELECT * FROM ${q.qName} ORDER BY ${queue.order}`
        
        const db = job [this.db.name]

        const data = await db.getObject (sql, [], {notFound: null}), notFound = data === null

        job.rq = notFound ? {} : {...queue.rq, data}; if (notFound) return

//      db.once ('released', () => self.check (queueName))

    }

    check (queue) {

        const name = queue.qName.slice (1, -1)

        setImmediate (() => {this.process ({[FIELD_NAME]: name})})

    }

    checkAll () {

        for (const o of this.db.model.objects ())
                
            if ('queue' in o)

                this.check (o)

    }

	setRouter (router) {

        const {pool} = router

        for (const [name, db] of this.app.pools.entries ()) if (pool.isSameDbAs (db)) {

            const {model} = db

            this.db = {name, model}

        }

        if (!('db' in this)) throw Error ("Listener's DB connection not found in application")

        super.setRouter (router)

        if (this.autoStart) router.on ('start', () => this.checkAll ())
        
	}

}