const {DbChannelPg} = require ('doix-db-postgresql')

const FIELD_NAME = 'payload'

module.exports = class extends DbChannelPg {

    constructor (app, o) {

        super (app, o)

        if (o.autoStart !== false) this.autoStart = true

        const self = this

        this.addHandler ('start', function () {

            const name = this.notification [FIELD_NAME]

            const q = self.db.model.find (name); if (!q) this.fail (`Queue '${name}' not found`)

            const {queue} = q; if (!queue) this.fail (`'${name}' is not a queue`)

            const db = this [self.db.name], sql = `SELECT * FROM ${q.qName} ORDER BY ${queue.order}`

            this.waitFor (

                db.getObject (sql, [], {notFound: null})

                .then (data => this.rq = data ? {...queue.rq, data} : {})

            )

        })

    }

    check (name) {

        this.process ({[FIELD_NAME]: name})

    }

    checkAll () {

        for (const schema of this.db.model.schemata.values ())

            for (const q of schema.map.values ()) if ('queue' in q)

                this.check (q.qName.slice (1, -1))

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