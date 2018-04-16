define ([], function () {        
    
    function from_to (data, id_from) {
    
        var from = id_from == data.author.id ? data.author : data.executor
        var to   = id_from == data.author.id ? data.executor : data.author
        
        return from.label + ' \u2192 ' + to.label

    }
        
    return function (data, view) {
    
        $('body').data ('data', data)
    
        $butt = $('.w2ui-buttons > span', view)

        data._can = {comment: data.id_user > 0 && data.users [$_USER.id]}

        $('title').text (data.label + ' (' + from_to (data, data.author.id) + ')')
        
        $.each (data.task_notes, function () {this.from_to = from_to (data, this.id_user)})
        
        fill (view, data, $('main'))
        
        window.scrollTo (0, document.body.scrollHeight);

    }

});