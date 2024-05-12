const {DbChannelPg, DbViewQueuePg} = require ('doix-db-postgresql')

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

        const queueName = job.notification [FIELD_NAME], queue = this.db.model.find (queueName)

        if (!queue) this.fail (`Queue '${queueName}' not found`)

        if (!(queue instanceof DbViewQueuePg)) this.fail (`'${queueName}' is not a queue`)

        const data = await job [this.db.name].peek (queue)

        queue.setRq (job, data)

        job.queue = queue

        if (data !== null) {

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
                
            if (o instanceof DbViewQueuePg)

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