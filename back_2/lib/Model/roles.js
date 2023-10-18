module.exports = {

    label: 'Роли',

    columns: {
        id       : 'int',
        name     : 'string // Символическое имя',
        label    : 'string // Наименование',
    },

    pk: 'id',

    data: [
        {id: 1, name: 'admin', label: 'Администратор'},
        {id: 2, name: 'user',  label: 'Пользователь'},
    ],

}