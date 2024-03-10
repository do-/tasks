const {HttpRouter} = require ('doix-http')
const {DbListenerPg, DbChannelPg} = require ('doix-db-postgresql')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_start_app: 

    async function () {

        await this.db.updateModel ()

        const {app, conf: {listen, db}} = this, {logger} = app

        app.dbListener = new DbListenerPg ({db, logger: this.db.logger})
        app.dbListener.add (new DbChannelPg (app, {
            name: 'mail',
            on: {
                start: function () {
                    this.rq = {type: 'tasks', action: 'notify', id: this.notification.payload}
                }
            },
        }))
        await app.dbListener.listen ()

        app.httpRouter = new HttpRouter ({listen, logger})
            .add (app.createBackService ())
        app.httpRouter.listen ()

    },

////////////////////////////////////////////////////////////////////////////////

do_stop_app: 

    async function () {

        const {app} = this       

//      await app.dbListener.close () // ?

        await app.httpRouter.close ()

    },

}