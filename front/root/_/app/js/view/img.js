$_DRAW.img = async function (data) {

	let $img = await to_fill ('img', {})

    $('textarea').on ('paste', $_DO.paste_img)

    $('#png', $img)
        .on ("dragover",  blockEvent)
        .on ("dragleave", blockEvent)
        .on ("drop",      $_DO.drop_img)
        .on ("click",     $_DO.click_img)

    $('video', $img).on ("click", $_DO.click_img)

    $('input[name=file]', $img).change ($_DO.open_img)
    
    return $img

}