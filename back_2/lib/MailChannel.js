const {DbChannelPg} = require ('doix-db-postgresql')

module.exports = class extends DbChannelPg {

    constructor (app) {

        super (app, {

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

        })

    }

}