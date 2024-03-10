const {DbListenerPg, DbChannelPg} = require ('doix-db-postgresql')

module.exports = class extends DbListenerPg {

    constructor (app) {

        const {db}     = app.globals.get   ('conf')
        const {logger} = app.pools.get ('db')

        super ({db, logger})

        this.add (new DbChannelPg (app, {
            name: 'mail',
            on: {

                start: function () {

                    const [id, one] = JSON.parse (this.notification.payload)

                    this.rq = {type: 'tasks', action: 'notify', id, one}

                },

                end: function () {

                    this.waitFor (this.smtp.sendMail (this.result))

                },
                
            },
        }))

    }

}