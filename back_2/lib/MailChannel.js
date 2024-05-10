const DbQueuesChannelPg = require ('./DbQueuesChannelPg')

module.exports = class extends DbQueuesChannelPg {

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

    }

}