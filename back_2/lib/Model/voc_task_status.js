module.exports = {

    label: 'Статусы задач',

    columns: {
        id       : 'int',
        label    : 'text // Наименование',
    },

    pk: 'id',

    keys : {
        label    : 'label',
    },

    data: [
        {id: 100, label: 'Проект'},
        {id: 101, label: 'Назначено'},
        {id: 102, label: 'Возвращено'},
        {id: 300, label: 'Архив'},
    ],

}