if (window.__LOGOUT__) delete window.__LOGOUT__

function get_default_url () {

    return '/tasks'

}

function setup_request () {

    var parts = location.pathname.split ('/').filter (function (i) {return i})
    
    if (!parts.length && $_USER && $_USER.role) return redirect (window.name = get_default_url ())

    $_REQUEST = {type: parts [0]}
    
    if (parts [1]) $_REQUEST.id = parts [1]

}

w2utils.settings = {
    weekStarts       : "M",
    "dataType"       : "JSON",
    "locale"         : "ru-RU",
    "dateFormat"     : "dd.mm.yyyy",
    "timeFormat"     : "h24",
    "currency"       : "^[-+]?[0-9]*[\\,]?[0-9]+$",
    "currencyPrefix" : "",
    "currencySuffix" : " р.",
    "currencyPrecision": 2,
    "decimalSymbol"  : ",",
    "groupSymbol"    : " ",
    "float"          : "^[-]?[0-9]*[\\.]?[0-9]+$",
    "shortmonths"    : ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    "fullmonths"     : ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    "shortdays"      : ["П", "В", "С", "Ч", "П", "С","В"],
    "fulldays"       : ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
    "phrases" : {
        "Add new record": "Добавить новую запись",
        "Add New": "Добавить",
        "All Fields": "Все поля",
        "Are you sure you want to delete selected records?": "Вы действительно хотите удалить выделенные записи?",
        "Attach files by dragging and dropping or Click to Select": "Перетащите файлы сюда или нажмите чтобы выбрать",
        "begins with": "начинается с",
        "begins": "начинается",
        "before": "до (включительно)",
        "after": "начиная с",
        "between": "между",
        "buffered": "буфер",
        "Clear Search": "Очистить поиск",
        "Column": "Колонка",
        "Confirmation": "Подтверждение",
        "contains": "содержит",
        "Delete Confirmation": "Подтверждение удаления",
        "Delete selected records": "Удалить выбранные записи",
        "Delete": "Удалить",
        "Edit selected record": "Изменить выделенную запись",
        "Edit": "Изменить",
        "Empty list": "Пустой список",
        "ends with": "заканчивается на",
        "ends": "заканчивается",
        "Hide": "Скрыть",
        "in": "в списке",
        "is": "равняется",
        "Loading...": "Загрузка...",
        "Multi Fields": "Несколько полей",
        "Multiple Fields": "Несколько полей",
        "more than": "более или ровно",
        "less than": "менее или ровно",
        "Name": "Имя",
        "Size": "Размер",
        "Type": "Тип",
        "Modified": "Дата изменения",
        "No items found": "Ничего не найдено",
        "No": "Нет",
        "none": "пусто",
        "null": "пусто",
        "Not a float": "Не натуральное число",
        "Not a hex number": "Не шестнадцатеричное число",
        "Not a valid date": "Неверный формат",
        "Not a valid email": "Неверный e-mail",
        "Not alpha-numeric": "Не буквенно-цифровой текст",
        "Not an integer": "Не целое число",
        "Not in money format": "Не денежный формат",
        "not in": "не в списке",
        "Notification": "Уведомление",
        "of": "из",
        "Ok": "OK",
        "Open Search Fields": "Открыть поля поиска",
        "Record ID": "Запись",
        "Records": "Записей",
        "Refreshing...": "Обновление...",
        "Reload data in the list": "Обновить список",
        "Remove": "Удалить",
        "Required field": "Обязательное поле",
        "Reset Column Size": "Восстановить размер колонок",
        "Reset": "Очистить",
        "Return data is not in JSON format. See console for more information.": "Возвращенные данные не в формате JSON. Смотрите в консоли ошибки.",
        "Save changed records": "Сохранить измененные записи",
        "Save": "Сохранить",
        "Saving...": "Сохранение",
        "Search took": "Поиск занял",
        "Search": "Поиск",
        "Search...": "Поиск...",
        "sec": "сек",
        "Select Search Field": "Выбрать поля поиска",
        "selected": "выделено",
        "Server Response": "Ответ сервера",
        "Show": "Показать",
        "Show/hide columns": "Показать/скрыть колонки",
        "Skip": "Пропустить",
        "Sorting took": "Сортировка заняла",
        "Toggle Line Numbers": "Вкл/Выкл. номера строк",
        "Yes": "Да",
        "Yesterday": "Вчера",
        "Line #": "Номер строки #",
        "Save Grid State": "Сохранить состояние таблицы",
        "Restore Default State": "Восстановить состояние таблицы",
        "Type to search...": "Введите строку поиска...",
        "Your remote data source record count has changed, reloading from the first record.": "Данные изменены на сервере. Пожалуйста, перезагрузите страницу"
    }
}

function dt_dmy    (v) { return !v ? '' : v.split ('-').reverse (). join ('.') }

function dt_dmy2   (v) { 
    if (!v) return ''
    var dmy = v.split ('-').reverse ()
    dmy [2] %= 100
    return dmy.join ('.')
}

function dt_dmyhms (v) { return !v ? '' : dt_dmy (v.substr (0, 10)) + v.substr (10,9)}

function __d (data) {

    for (i in data) {
    
        if (i.match (/^dt/)) {

            var v = data [i]

            if (!v || v.length != 10 || !v.match (/^\d\d\d\d-\d\d-\d\d$/)) continue

            data [i] = dt_dmy (v)

        }        
    
    }
    
    return data

}

function die (name, text) {
    alert (text)
    $('[name=' + name + ']').focus ()
    throw 'core.ok.validation'
}

function not_off (i) {return !i.off}

function reload_page () { location.reload () }

function _ts (record, ind, col_ind, data) {
    if (!data) return ''
    return data.slice (0, 10) + ' ' + data.slice (11, 19)
}

function svg (icon) {return staticURL (            
    `libs/tasks/svg/${icon}.svg`            
)}

clearTimeout (window.alarm)

$_SESSION.beforeExpiry ($_SESSION.keepAlive)

window.addEventListener ('storage', $_SESSION.closeAllOnLogout)

if ($_USER && $_USER.opt && $_USER.opt.no_tabs) openTab = function (url, name) {
    window.name = name || url
    location = url
}

setup_request ()

show_block ($_USER ? 'main' : 'login')