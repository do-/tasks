define ([], function () {

    return function (data, view) {
    
        $(view).w2uppop ({}, function () {
            
            $('#w2ui-popup .w2ui-form').w2reform ({
            
                name: 'tasks_new_form',
                
                record: {},
    
                fields : [                
                    {name: 'label',   type: 'text'},
                    {name: 'id_user', type: 'list', options: {items: data.users.items}},
                ],
                                
            });
    
            clickOn ($('#w2ui-popup button'), $_DO.update_tasks_new)
    
        })

    }    
    
})