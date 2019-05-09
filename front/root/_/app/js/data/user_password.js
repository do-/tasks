////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_password = async function (e) {

    let $this = $(e.target).closest ('.ui-dialog').find ('.ui-dialog-content')

    let data = values ($this)    
    
    if (!data.p1) die ('p1', 'Вы не ввели пароль');
    if (!data.p2) die ('p2', 'Ввод пароля необходимо повторить');
    
    if (data.p1 != data.p2) return alert ('Вам не удалось ввести одно значение пароля дважды');

    $_REQUEST._secret = ['p1', 'p2']
    
    if ($_USER.role != 'admin') delete data.id

    $this.dialog ("widget").block ()
    
    await response ({type: 'users', action: 'set_password'}, {data})
    
    $this.dialog ("close")

    alert ('Пароль установлен')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_password = async function (o) {
                    
    return $('body').data ('data')
            
}
    