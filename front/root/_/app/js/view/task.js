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
        
        $.each (data.task_notes, function () {
        
            this.from_to = data.users [this.id_user_from]
            
            if (this.id_user_from == this.id_user_to) return
            
            this.from_to += ' \u2192 '
            this.from_to += data.users [this.id_user_to]
        
        })
        
        fill (view, data, $('main'))
        
        window.scrollTo (0, document.body.scrollHeight);

    }

});