const _ = exports

// #############################################################################

_.select = async function ($_REQUEST) {

//darn (['select this', this])

    return {"portion":100,"tasks":[{"id_user":1,"id_last_task_note":"60","task_note":{"is_illustrated":0,"id_task":"22","body":"","label":"nbcmnc","fake":0,"id":"60","ts":"2018-04-16 18:22:20.599025","uuid":"73f7ba7d-8c4a-447b-a26d-9cb42a424dd2","id_user_from":1,"id_user_to":1,"ext":null},"id":"22","fake":0,"label":"E-mail","ts":"2018-04-16 15:46:46.99786","uuid":"849059f5-dcd1-45ba-90fa-72d131e4769d"}],"cnt":"1"}

}

// #############################################################################

_.get_vocs = async function ($_REQUEST) {

//darn (['get_vocs this', this])

//    return await $_DB.select_all ("SELECT id, label, fake FROM users WHERE 1=1 AND fake = 0 AND id > 0 ORDER BY 2");

    return {"users":[{"label":"Овсянко Дмитрий","id":1,"fake":0},{"label":"Потапов Виталий","fake":0,"id":2}]}

}