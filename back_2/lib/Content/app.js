const {HttpRouter} = require ('doix-http')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_start_app: 

    async function () {

        await this.db.updateModel ()

        const {app, conf: {listen}} = this, {logger} = app

        app.httpRouter = new HttpRouter ({listen, logger})
            .add (app.createBackService ())

        app.httpRouter.listen ()

    },

////////////////////////////////////////////////////////////////////////////////

do_stop_app: 

    async function () {

        await this.app.httpRouter.close ()
        
    },

}