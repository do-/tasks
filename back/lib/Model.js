const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class extends Dia.DB.Model {

    on_before_parse_table_columns (table) {

        let cols = table.columns
        
        if (cols.id) {
            table.pk = 'id'
        } 
        else {
            cols [table.pk = 'uuid'] = 'uuid=uuid_generate_v4()'
        }
        
    }

}