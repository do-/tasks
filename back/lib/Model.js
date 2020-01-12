const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class extends Dia.DB.Model {

    on_before_parse_table_columns (table) {

        let cols = table.columns
        
        if (!table.pk) {
        
			if (cols.id) {
				table.pk = 'id'
			} 
			else {
				cols [table.pk = 'uuid'] = 'uuid=uuid_generate_v4()'
			}
        
        }
                
    }

    on_after_parse_table_columns (table) {

    	if (this.has_validation (table)) {

    		if (!table.triggers) table.triggers = {}

    		if (!table.triggers.before_insert_update) table.triggers.before_insert_update = '/*+ VALIDATE ALL */ RETURN NEW;'

    	}	

	}

}