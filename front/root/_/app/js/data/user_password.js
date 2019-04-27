////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_password = async function (e) {

    var data = w2ui ['passwordForm'].record
    
    if (!data.p1) return alert ('Вы не ввели пароль');
    if (!data.p2) return alert ('Ввод пароля необходимо повторить');
    
    if (data.p1 != data.p2) return alert ('Вам не удалось ввести одно значение пароля дважды');

    $_REQUEST._secret = ['p1', 'p2']
    
    if ($_USER.role != 'admin') delete data.id
    
    await response ({type: 'users', id: $_REQUEST.id, action: 'set_password'}, {data: data})
    
    alert ('Пароль установлен')

    w2popup.close ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_password = async function (o) {
                    
    return $('body').data ('data')
            
}
    