$_DO.open_tasks_nav = function () {
    openTab ('/tasks')
}

$_DO.open_task_notes_nav = function () {
    openTab ('/task_notes')
}

$_DO.open_users_nav = function () {
    openTab ('/users')
}

$_DO.open_user_password_nav = function () {
    use.block ('user_password')
}
    
$_DO.open_settings_nav = function () {
    use.block ('user_own_options')
}

$_DO.open_users_select_nav = function () {
    use.block ('user_peers')
}

$_DO.logout_nav = function () {
        
    query ({type: 'sessions', action: 'delete'}, {}, $.noop, $.noop)
    
    $_SESSION.end ()

    redirect ('/')

}

$_GET.nav = async function (o) {

    let is_admin = ($_USER.role == 'admin')

    return {_can: {
        open_tasks: true,
        open_task_notes: true,
        open_users: is_admin,
        open_user_password: !is_admin,
        open_settings: true,
        open_users_select: true,
        open_help: false,
        logout: true
    }}
    
}