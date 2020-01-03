module.exports = {

    label : 'Корреспонденты',

    columns : {
        id_user            : '(users) // Пользователь',            
        id_user_ref        : '(users) // Корреспондент',           
    },

    pk : ['id_user', 'id_user_ref'],
    
    on_before_recreate_table: (table) => {
        	
    	if (table.existing.columns.is_on) return {
    		sql    : 'DELETE FROM user_users WHERE is_on=?',
    		params : [0],
    	}
    	    
    }    

}