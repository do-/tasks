define ([], function () {

    return function (data, view) {

        $(view).w2uppop ({}, function () {

            var users = clone (data.users.items)

            if (!data.record.is_assigning) {
            
                if ($_USER.id == data.author.id) users.push ({id: "0", text: 'Никто. Дело окончно.'})

                $.each (users, function () {if (this.id == $_USER.id) this.text = 'Я, ' + this.text})

            }

            $('#w2ui-popup .w2ui-form').w2reform ({
            
                name: 'task_comment_form',

                record: data.record,

                fields : [                
                    {name: 'label',   type: 'text'},
                    {name: 'id_user_to', type: 'list', options: {items: users}},
                ],
                
                focus: data.record.id_user_to ? 1 : 0,
                
                onRefresh: function (e) {
                
                    e.done (function () {

                        use.block ('img')

                    })
                
                }
                
            })
            
        })

    }
    
})