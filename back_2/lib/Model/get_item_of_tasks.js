module.exports = {

    label: 'get_item_of_tasks',

    parameters: [
        '_uuid UUID',
    ],

    lang: 'SQL',

    returns: 'JSONB',

	body: /*sql*/`

        WITH 
            t1 AS (SELECT ROW_TO_JSON (t) v FROM vw_tasks t WHERE uuid = _uuid),
            t2 AS (SELECT JSONB_AGG (ROW_TO_JSON (t) ORDER BY t.ts) AS v FROM task_notes t WHERE t.id_task = _uuid),
            t3 AS (SELECT JSONB_AGG (ROW_TO_JSON (t) ORDER BY t.ts) AS v FROM task_tasks r JOIN vw_tasks t ON r.id_task = t.uuid WHERE r.id_task_to = _uuid),
            t4 AS (SELECT JSONB_AGG (ROW_TO_JSON (t) ORDER BY t.ts) AS v FROM task_tasks r JOIN vw_tasks t ON r.id_task_to = t.uuid WHERE r.id_task = _uuid),
            t5 AS (SELECT JSONB_AGG (JSONB_BUILD_OBJECT ('id', uuid, 'label', label) order by label) AS v FROM voc_projects)
        SELECT
            JSONB_BUILD_ARRAY (
                t1.v
                , t2.v
                , COALESCE (t3.v, '[]')
                , COALESCE (t4.v, '[]')
                , t5.v
            )
        FROM
            t1, t2, t3, t4, t5
    `,

}