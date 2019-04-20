$_DRAW.login = async function (data) {
        
    let $body = $('body').html (`
        <main>
        <div class=login-outer style="height: 100%; display: flex; flex-direction: row; flex-wrap: nowrap; justify-content: center; align-items: center; align-content: stretch;">

            <div class="login-inner w2ui-reset w2ui-form" style="height: 175px; width: 400px;">

                    <div class="w2ui-form-box">
                        <div class="w2ui-form-header">Вход в систему</div>
                    </div>

                    <div class="w2ui-page page-0" style="overflow:inherit">

                          <div class="w2ui-field">
                             <label>Login</label>
                             <div><input name="login" class="w2ui-input" type="text" style="width: 140px"></div>
                          </div>
                          <div class="w2ui-field">
                             <label>Пароль</label>
                             <div><input name="password" class="w2ui-input" type="password" style="width: 140px"></div>
                          </div>

                    </div>

                    <div class="w2ui-buttons">
                        <button name="execute" class="w2ui-btn" style="">Войти</button>
                    </div>

                </div>

            </div>
        </div>
        </main>
    `)

    $('div.login-inner').w2form ({
    
        name   : 'form',            
        header : 'Вход в систему',
                    
        fields : [
            { field: 'login',     type: 'text',     },
            { field: 'password',  type: 'password', },
        ],

        actions: {            
            'execute': {caption: 'Войти', onClick: $_DO.execute_login},                                
        }
        
    })
    
    $('input[name=login]').keypress    (function (e) {if (e.which == 13) $('input[name=password]').focus ()})
    $('input[name=password]').keypress (function (e) {if (e.which == 13) $_DO.execute_login ()})
    
    return $body

}