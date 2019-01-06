module.exports = {

    label: 'Сессии',

    columns: {
        id_user : '(users)',
        ts          : 'datetime',
        client_cookie   : 'string [255]',
    },

    keys: {
        id_user         : 'id_user',
        ts              : 'ts',
        client_cookie   : 'client_cookie',
    },

    data: [
        {id : 1, fake : 0, id_user : -2},
    ],

}
