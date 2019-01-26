module.exports = {

    label : 'Корреспонденты',

    columns : {
        id_user            : '(users) // Пользователь',            
        id_user_ref        : '(users) // Корреспондент',           
        is_on              : 'int=0   // Статус (0 — нет, 1 — есть)',             
    },

    keys : {
        id_user    : 'UNIQUE (id_user,id_user_ref) WHERE fake = 0',
    },

}