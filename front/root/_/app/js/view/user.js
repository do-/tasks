define ([], function () {

    $_F5 = function (data) {
    
        var f = w2ui ['form']

        f.record = data

        $('main input').prop ({disabled: data.__read_only})

        f.refresh ()

    }

    return function (data, view) {
    
        $('body').data ('data', data)

        $('title').text (data.label)

        var layout = $('main').w2layout ({

            name: 'main',

            panels: [
                { type: 'top', size: 230},
                { type: 'main', size: 400,

                    tabs: {

                        tabs: [
                            { id: 'user_options', caption: 'Опции'},
                        ],

                        onClick: $_DO.choose_tab_user

                    }                

                },
            ],
            
            onRender: function (e) {
                this.get ('main').tabs.click (data.active_tab)
            }
            
            
        });

        var $panel = $(layout.el ('top'))
        
        fill (view, data, $panel)
                
        $panel.w2reform ({

                name   : 'form',
                
                fields : [
                
                    { name: 'label', type: 'text', required: true},
                    { name: 'login', type: 'text', required: true},
                    { name: 'mail',  type: 'text'},
//                    { name: 'is_read_only', type: 'checkbox'},
                ],            

        })
                        
        $_F5 (data)

    }

})