$_DRAW.tasks_new = async function (data) {

    return (await use.jq ('tasks_new')).w2uppop ({}, function () {
        
        $('#w2ui-popup .w2ui-form').w2reform ({
        
            name: 'tasks_new_form',
            
            record: {id_user: $_USER.id},

            fields : [                
                {name: 'label',   type: 'text'},
                {name: 'body',    type: 'text'},
            ],
                            
            onRefresh: function (e) {
            
                e.done (function () {

                    $('#img').show_block ('img')

                })
            
            }

        })

    })

}