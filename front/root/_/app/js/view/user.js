$_DRAW.user = async function (data) {

    var __read_only = 1

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

    $(layout.el ('top')).html (`
    
        <div>

            <div class="w2ui-page page-0">

                <header>
                    ${data ['role.label']} ${data.label}
                </header>

                <div class="w2ui-field">
                    <label>ФИО</label>
                    <div>
                        <input name="label" style="width:300px" />
                    </div>
                </div>

                <div class="w2ui-field">
                    <label>login</label>
                    <div>
                        <input name="login" style="width:300px" />
                    </div>
                </div>

                <div class="w2ui-field">
                    <label>E-mail</label>
                    <div>
                        <input name="mail" style="width:300px" />
                    </div>
                </div>

            </div>

            <div class="w2ui-buttons">
                <span>
                
                    <button class=w2ui-btn name=edit   >Редактировать</button>
                    <button class=w2ui-btn name=pass   >Установить пароль</button>
                    <button class=w2ui-btn name=delete >Удалить</button>

                    <button class=w2ui-btn name=update data-edit>Сохранить</button>
                    <button class=w2ui-btn name=cancel data-edit>Отменить</button>

                </span>
            </div>

        </div>        
    
    `).w2reform ({

        name: 'form',
        
        record: data,
        
        fields: [                
            {name: 'label', type: 'text'},
            {name: 'login', type: 'text'},
            {name: 'mail',  type: 'text'},
        ],            
        
        actions: {
        
            pass:   $_DO.pass_user,                
            delete: $_DO.delete_user,
            update: $_DO.update_user,

            edit:   function () {__read_only = 0; this.refresh ()},
            
            cancel: function () {
                if (!confirm ('Отменить несохранённые правки?')) return
                __read_only = 1; 
                this.record = clone (data)
                this.refresh ()
            },
            
        },
        
        onRefresh: function (e) {
        
            $('main input').prop ({disabled: __read_only})
            
            $('.w2ui-buttons button').each (function () {
                let $this = $(this)
                let is_ro = $this.is ('[data-edit]') ? 0 : 1
                $this.css ({display: is_ro == __read_only ? 'inline-block' : 'none'})
            })

        }

    })

}