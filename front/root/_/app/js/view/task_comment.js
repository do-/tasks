define ([], function () {

    return function (data, view) {
    
        $(view).w2uppop ({}, function () {

            var users = JSON.parse (JSON.stringify (data.users.items))

            $.each (users, function () {if (this.id == $_USER.id) this.text = 'Я, ' + this.text})

            if ($_USER.id == data.author.id) users.push ({id: null, text: 'Никто. Дело окончно.'})

            $('#w2ui-popup .w2ui-form').w2reform ({
            
                name: 'task_comment_form',

                record: darn({
                    id_user: {id: parseInt (data.author.id) + parseInt (data.executor.id) - $_USER.id}
                }),

                fields : [                
                    {name: 'label',   type: 'text'},
                    {name: 'id_user_to', type: 'list', options: {items: users}},
                ],
                
                focus: 1,

            });

            clickOn ($('#w2ui-popup button'), $_DO.update_task_comment)
            
//            $('textarea').keydown (function (e) {
            
//                if (e.ctrlKey && e.keyCode == 13) $_DO.update_task_comment ()
            
//            })

        })

    }
    
})