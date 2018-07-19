define ([], function () {

    return function (data, view) {

        var users = clone (data.users.items)

        $.each (users, function () {if (this.id == $_USER.id) this.text += ' (то есть я же)'})
    
        $(view).w2uppop ({}, function () {
            
            $('#w2ui-popup .w2ui-form').w2reform ({
            
                name: 'tasks_new_form',
                
                record: {},
    
                fields : [                
                    {name: 'label',   type: 'text'},
                    {name: 'body',    type: 'text'},
                    {name: 'id_user', type: 'list', options: {items: users}},
                ],
                
                onRefresh: function (e) {
                
                    e.done (function () {

                        use.block ('img')

                    })
                
                }

            })

        })

    }

})