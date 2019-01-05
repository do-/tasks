module.exports = {

    label: 'Роли',

    columns: {
        name     : 'string // Символическое имя',
        label    : 'string // Наименование',
    },

    keys : {
        label    : 'label',
    },

    data: [
        {id: 1, fake: 0, name: 'admin', label: 'Администратор'},
        {id: 2, fake: 0, name: 'user',  label: 'Пользователь'},
    ],

}