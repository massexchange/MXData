const
    { sql, table } = require("../helpers/util");

module.exports = (typeId, mpId) => sql`
    select a.id id, name, value
    from
        ${table("Cache_Elements")},
        ${table("Attributes")},
        ${table("Attribute_Types")}
    where
        attrCacheId in (
            select id from Attribute_Caches
            where
                mpId = @${mpId} and
                attrTypeId = ${typeId}
        ) and
        a.id = ce.attrId and
        at.id = a.typeId;
`;
