////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_password = async function (data) {
    
    if (data.p1 != data.p2) return alert ('Вам не удалось ввести одно значение пароля дважды');

    $_REQUEST._secret = ['p1', 'p2']
    
//    if ($_USER.role != 'admin') delete data.id; 

    const {id} = data
    
    await response ({type: 'users', id, action: 'set_password'}, {data})
    
    DevExpress.ui.notify ({ message: 'Пароль установлен', width: 300, shading: true }, 'success', 500)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_password = async function (o) {
                    
    return o
            
}
    