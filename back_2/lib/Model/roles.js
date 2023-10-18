module.exports = {

    label: 'Роли',

    columns: {
        id       : 'int',
        name     : 'text // Символическое имя',
        label    : 'text // Наименование',
    },

    pk: 'id',

    data: [
        {id: 1, name: 'admin', label: 'Администратор'},
        {id: 2, name: 'user',  label: 'Пользователь'},
    ],

}