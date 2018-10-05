define ([], function () {
    
    return function (data, view) {
            
        $(view).w2uppop ({}, function () {

            $('#w2ui-popup .w2ui-form').w2reform ({
            
                name: 'user_peers_form',
                
                record: {},

                fields : [],

            });

            $('.w2ui-form .the_table_container').w2regrid ({ 

                name   : 'user_peers_grid', 

                show: {
                    toolbar: false,
                    footer: false,
                    toolbarSearch   : false,
                    toolbarInput    : false,
                    skipRecords: false,
                    selectColumn: true,
                },           

                columns: [                
                    {field: 'label', caption: 'Имя',  size: 10},
                ],

                records: data.users,

                onRender: function (e) {

                    var grid = this

                    e.done (function () {

                        $.each (data.users, function () {

                            if (this ['user_user.id']) grid.select (this.recid)

                        })

                    })                

                }

            })
            .refresh ()

            $('#grid_user_peers_grid_check_all').hide ()

        });

    }

});