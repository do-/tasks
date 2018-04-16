define ([], function () {

    $_DO.open_tasks_nav = function () {
        openTab ('/tasks', '/tasks')
    }

    $_DO.open_users_nav = function () {
        openTab ('/users', '/users')
    }
    
    $_DO.open_user_password_nav = function () {
        use.block ('user_password')
    }
        
    $_DO.open_settings_nav = function () {
        use.block ('user_own_options')
    }
/*
    $_DO.open_help_nav = function () {
        openTab ('https://.../docs/')
    }
*/
    $_DO.logout_nav = function () {
            
        query ({type: 'sessions', action: 'delete'}, {}, $.noop, $.noop)
        
        $_SESSION.end ()

        redirect ('/')

    }

    return function (done) {
    
        var is_admin = ($_USER.role == 'admin')
    
        var data = {_can: {
            open_tasks: true,
            open_users: is_admin,
            open_user_password: is_admin,
            open_settings: true,
            open_help: false,
            logout: true
        }}

        done (data)
        
    }
    
})