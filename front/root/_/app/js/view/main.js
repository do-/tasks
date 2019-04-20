
define ([], function () {

    function get_single (s) {

        // if (s == '...') return '...' // exceptions

        return en_unplural (s)

    }

    function getBlockType () {
    
        if (!$_USER) return 'login'
        
        return $_REQUEST.id ? get_single ($_REQUEST.type) : $_REQUEST.type
        
    }
    
    return function () {           

        $('body').html (`
            <nav class="left-sidebar"></nav>
            <main></main>
        `)
        
        use.block (getBlockType ())
        use.block ('nav')
        
    }

});