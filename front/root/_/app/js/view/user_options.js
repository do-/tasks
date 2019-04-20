$_DRAW.user_options = async function (data) {

    $(w2ui ['main'].el ('main')).w2regrid ({ 
    
        name   : 'options_grid', 

        show: {
            toolbar: true,
            footer: false,
            toolbarSearch   : false,
            toolbarInput    : false,
            skipRecords: false,
        },           

        columns: [                
            {field: 'label',                caption: 'Опция',         size: 10},
            {field: 'foo',                caption: 'Статус',         size: 10, render: function (i) {return i ['user_options.is_on'] ? 'Установлено' : ''}},
        ],

        url: '_back/?type=users&part=options&id=' + data.uuid,

        onDblClick: $_DO.toggle_user_options,

    })
    .refresh ()

    $('.w2ui-search-all').focus ()

}