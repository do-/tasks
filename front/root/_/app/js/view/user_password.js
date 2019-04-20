$_DRAW.user_password = async function (data) {

    (await use.jq ('user_password')).w2popup ('open', {

        width  : 230,
        height : 195,

        title   : 'Смена пароля',

        onOpen: function (e) {

            e.done (function () {               
            
                $('#w2ui-popup .w2ui-form').w2reform ({

                    name: 'passwordForm',

                    record: {},

                    fields : [
                        {name: 'p1', type: 'password'},
                        {name: 'p2', type: 'password'},
                    ],
                    
                })
                
            })
            
        }
        
    })
    
}