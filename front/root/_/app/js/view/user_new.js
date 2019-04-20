$_DRAW.user_new = async function (data) {

    (await use.jq ('user_new')).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'users_new_form',

            record: {},

            fields : [                
                {name: 'label',   type: 'text'},
                {name: 'login',   type: 'text'},
                {name: 'id_role', type: 'list', options: {items: data.roles.items}},
            ],
                            
        })
    
    })

}
