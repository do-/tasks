const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class extends Dia.DB.Model {

    adjust_table (table) {

        let cols = table.columns
        
        cols.id   = 'int'
        cols.fake = 'int'
        if (table.name != 'sessions' && table.name != 'task_users' && table.name != 'roles' && table.name != 'user_users' && table.name != 'voc_user_options') cols.uuid = "uuid=uuid_generate_v4()"

        table.pk = 'id'

    }

}