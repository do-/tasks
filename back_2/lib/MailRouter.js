const {DbQueuesRouterPg} = require ('doix-db-postgresql')

module.exports = class extends DbQueuesRouterPg {

    constructor (app) {

        const {base} = app.globals.get ('conf')

        super (app, {

            on: {

                'job-end': async job => {

                    const {result} = job, {id} = result

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

                    job.waitFor (job.smtp.sendMail (result))

                },
                
            },

        })

    }

}