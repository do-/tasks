////////////////////////////////////////////////////////////////////////////////

$_GET.task_refs = async function (o) {

	if (o.refs) for (let r of o.refs) if (!r ['vw_tasks.uuid']) for (let k in r) r ['vw_tasks.' + k] = r [k]

    return o
    
}