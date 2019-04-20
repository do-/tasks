$_DRAW.nav = async function (data) {

    var $nav = $(`
    
        <nav class="left-sidebar">
        <header>
            <button name=open_tasks title="Дела" class="svg-menu"></button>
            <button name=open_task_notes title="Всеобщая переписка" class="svg-xchg"></button>
            <button name=open_help title="Справка" class="svg-help"></button>
            <button name=open_users title="Пользователи" class="svg-users"></button>
        </header>

        <footer>
            <button name=open_users_select title="Корреспонденты" class="svg-users"></button>
            <button name=open_user_password title="Смена пароля" class="svg-keys"></button>
            <button name=open_settings title="Настройки" class="svg-settings"></button>
            <button name=logout title="Выход" class="logout svg-logout" data-question="Завершить работу в системе?"></button>
        </footer>
        </nav>
        
    `).insertBefore ($('main'))
    
    $('button', $nav).each (function () {
    
        let $this = $(this)
        
        let name = this.name
        
        if (!data._can [name]) return $this.remove ()
        
        clickOn ($this, $_DO [name + '_nav'])

        if (location.href.indexOf (name.substr (5)) >= 0) $this.addClass ('active')
    
    })
    
    $('body > nav header button').after ('<hr>')
    $('body > nav footer button').before ('<hr>')
    
    return $nav

}