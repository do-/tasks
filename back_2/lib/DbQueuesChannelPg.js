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

        {

            const q = this.db.model.find (queueName); if (!q) this.fail (`Queue '${queueName}' not found`)

            job.queue = q

        }

        const {qName, queue} = job.queue; if (!queue) this.fail (`'${queueName}' is not a queue`)

        const sql = `SELECT * FROM ${qName} ORDER BY ${queue.order}`

        const data = await job [this.db.name].getObject (sql, [], {notFound: null}), isFound = data !== null

        job.rq = isFound ? {...queue.rq, data} : {}

        if (isFound) {

            const db = job [this.db.name]

            db.once ('released', () => this.onDbReleased (db))

        }

    }

    onDbReleased ({job: {queue, error}}) {

        if (error) return

        this.check (queue)

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