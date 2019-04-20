$_DRAW.user_own_options = async function (data) {

    (await use.jq ('user_own_options')).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({
        
            name: 'user_own_options_form',
            
            record: {},

            fields : [],

        })

        $('.w2ui-form .the_table_container').w2regrid ({ 

            name   : 'user_own_options_grid', 

            show: {
                toolbar: false,
                footer: false,
                toolbarSearch   : false,
                toolbarInput    : false,
                skipRecords: false,
            },           

            columns: [                
                {field: 'label', caption: 'Опция',  size: 10},
                {field: 'foo',   caption: 'Статус', size: 10, render: function (i) {return i ['user_options.is_on'] ? 'Установлено' : ''}},
            ],

            url: '_back/?type=users&part=own_options',

            onDblClick: $_DO.toggle_user_own_options,

        })
        .refresh ()

        $('#grid_user_own_options_grid_check_all').hide ()

    })

}