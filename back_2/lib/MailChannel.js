const {DbChannelPg} = require ('doix-db-postgresql')

module.exports = class extends DbChannelPg {

    constructor (app) {

        const {base} = app.globals.get ('conf')

        super (app, {

            name: 'mail',

            on: {

                start: function () {

                    const name = this.notification.payload, type = name + '_notifications'

                    this.rq = {type, action: 'process'}

                },

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

    }

}