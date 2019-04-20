$_DRAW.img = async function (data) {

    let $img = $(`
        <span>

            <input name=img type=hidden>
            <input name=ext type=hidden>
            <input name=file type=file style="display:none">

            <img id=png title=
                "Чтобы проиллюстрировать текст,
                 скопируйте PNG (например, инструментом 'ножницы')
                 и вставьте из буфера (Ctrl-V, Shift-Insert) прямо в текстовую область"
            >

            <video id=mp4 autoplay loop>
            </video>

        </span>
    `)

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