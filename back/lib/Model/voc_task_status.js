module.exports = {

    label: 'Статусы задач',

    columns: {
        id       : 'int',
        label    : 'string // Наименование',
    },

    keys : {
        label    : 'label',
    },

    data: [
        {id: 100, label: 'Проект'},
        {id: 101, label: 'Назначено'},
        {id: 200, label: 'Возвращено'},
        {id: 300, label: 'Архив'},
    ],

}