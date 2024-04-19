const {DbChannelPg} = require ('doix-db-postgresql')

module.exports = class extends DbChannelPg {

    constructor (app) {

        const {base} = app.globals.get ('conf')

        super (app, {

            name: 'mail',

            on: {

                end: function () {

                    const {result} = this, {id} = result

                    result.html = `
                    <html>
                        <head>
                            <base href="${base}">
                        </head>
                        <body>
                            ${result.html}
                            <br><br>
                            <small><a href="/tasks/${id}">${id}</a></small>
                        </body>
                    </html>`

                    this.waitFor (this.smtp.sendMail (result))

                },
                
            },

        })

        const self = this

        this.addHandler ('start', function () {

            const name = this.notification.payload

            const q = self.db.model.find (name); if (!q) this.fail (`Queue '${name}' not found`)

            const {queue} = q; if (!queue) this.fail (`'${name}' is not a queue`)

            const db = this [self.db.name], sql = `SELECT * FROM ${q.qName} ORDER BY ${queue.order}`

            this.waitFor (

                db.getObject (sql, [], {notFound: null})

                .then (data => this.rq = data ? {...queue.rq, data} : {})

            )

        })

    }

	setRouter (router) {

        const {pool} = router

        for (const [name, db] of this.app.pools.entries ()) if (pool.isSameDbAs (db)) {

            const {model} = db

            this.db = {name, model}

        }

        if (!('db' in this)) throw Error ("Listener's DB connection not found in application")

        super.setRouter (router)

	}

}