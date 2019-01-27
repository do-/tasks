module.exports = {

    label: 'Сессии',

    columns: {
        id_user : '(users)',
        ts          : 'datetime',
        client_cookie   : 'string [255]',
    },

    keys: {
        id_user         : 'id_user',
        client_cookie   : 'UNIQUE (client_cookie)',
    },

}
