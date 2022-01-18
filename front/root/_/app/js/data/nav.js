////////////////////////////////////////////////////////////////////////////////

$_DO.open_search_nav = function () {
    show_block ('tasks_search')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_help_nav = function () {
    openTab ('/help')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_tasks_nav = function () {
    openTab ('/tasks')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_task_notes_nav = function () {
    openTab ('/task_notes')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_users_nav = function () {
    openTab ('/users')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_user_password_nav = function () {
    show_block ('user_password')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_settings_nav = function () {
    show_block ('user_own_options')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_users_select_nav = function () {
    show_block ('user_peers')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.logout_nav = function () {
        
    query ({type: 'sessions', action: 'delete'}, {}, $.noop, $.noop)
    
    $_SESSION.end ()

    redirect ('/')

}

////////////////////////////////////////////////////////////////////////////////

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

$_GET.nav = async function (o) {

    let is_admin = ($_USER.role == 'admin')
    
    return {
    
        header: [
        
            {
                id: "open_tasks",
                label: "Дела",
                icon: "menu",
            },
            {
                id: "open_task_notes",
                label: "Переписка",
                icon: "xchg",
            },
            {
                id: "open_search",
                label: "Найти",
                icon: "find",
                hotkey: "F7",
            },
            {
                id: "open_help",
                label: "Справка",
                icon: "help",
                hotkey: "F1",
            },
            {
                id: "open_users",
                label: "Пользователи",
                icon: "users",
                off: !is_admin
            },
            
        ].filter (not_off),
        
        footer: [
        
            {
                id: "open_users_select",
                label: "Корреспонденты",
                icon: "users",
            },
            {
                id: "open_user_password",
                label: "Смена пароля",
                icon: "keys",
            },
/*            
            {
                id: "open_settings",
                label: "Настройки",
                icon: "settings",
            },
*/
            {
                id: "logout",
                label: "Выход",
                icon: "logout",
            },
            
        ].filter (not_off),
        
    }
    
}