module.exports = {

    label: 'All actual projects, for pick lists',

    lang: 'SQL',

    returns: 'JSONB',

	body: /*sql*/`

        SELECT 
            JSONB_AGG (JSONB_BUILD_OBJECT ('id', uuid, 'label', label) ORDER BY label) 
        FROM 
            voc_projects 
        WHERE 
            is_deleted = 0

    `,

}