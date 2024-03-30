module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_start_app: 

    async function () {

        const {app, db} = this

        await db.updateModel ()

        await app.mailChannel.listen ()

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