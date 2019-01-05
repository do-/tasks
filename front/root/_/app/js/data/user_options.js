define ([], function () {

    $_DO.toggle_user_options = function (e) {

        var g = w2ui ['options_grid']
        
        var data = {}

        var r = g.get (data.id_voc_user_option = e.recid)

        data.is_on = 1 - (r ['user_options.is_on'] || 0)

        if (!confirm ((data.is_on ? 'Установить' : 'Снять') + ' опцию "' + r.label + '"?')) return

        query ({action: 'set_option'}, {data: data}, function () {g.request ('get')})

    }

    return function (done) {

        done ($('body').data ('data'))

    }

})