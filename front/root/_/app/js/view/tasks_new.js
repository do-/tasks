define ([], function () {

    return function (data, view) {

        var users = JSON.parse (JSON.stringify (data.users.items))

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

            })

        })

    }

})