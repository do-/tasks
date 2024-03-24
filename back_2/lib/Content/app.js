const {HttpRouter} = require ('doix-http')
const MailChannel = require ('../MailChannel.js')
const {DbListenerPg, DbChannelPg} = require ('doix-db-postgresql')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_start_app: 

    async function () {

        await this.db.updateModel ()

        const {app, conf: {listen}} = this, {logger} = app

        app.mailChannel = new MailChannel (app)
        await app.mailChannel.listen ()

        app.httpRouter = new HttpRouter ({listen, logger})
            .add (app.createBackService ())
        app.httpRouter.listen ()

    },

////////////////////////////////////////////////////////////////////////////////

do_stop_app: 

    async function () {

        const {app} = this       

        await app.mailChannel.close ()

        await app.httpRouter.close ()

    },

}