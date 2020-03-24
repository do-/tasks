module.exports = {

    label : 'Проекты',

    columns : {
        uuid       : 'uuid=uuid_generate_v4()',
        is_deleted : 'int=0                                       // 1, если удалён', 
        label      : 'string                                      // Наименование',
    },

}