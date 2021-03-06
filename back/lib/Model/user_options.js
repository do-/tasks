module.exports = {

    label : 'Опции пользователей',

    columns : {
        id_user            : '(users)            // Пользователь', 
        id_voc_user_option : '(voc_user_options) // Опция', 
    },

    pk : ['id_user', 'id_voc_user_option'],
    
    on_before_recreate_table: (table) => {
        	
    	if (table.existing.columns.is_on) return {
    		sql    : 'DELETE FROM user_options WHERE is_on=?',
    		params : [0],
    	}
   
    }

}