const
    { sql, aliases, idRef, fieldRef, fromTables } = require("../helpers/util");

const entities = [
    "Cache_Elements",
    "Attributes",
    "Attribute_Types"];
const { ce, a, at } = aliases(entities);

module.exports = (typeId, mpId) => sql`
    select ${idRef(a)}, name, value
    ${fromTables(entities)}
    where
        attrCacheId in (
            select id from Attribute_Caches
            where
                mpId = @${mpId} and
                attrTypeId = ${typeId}
        ) and
        ${idRef(a)} = ${fieldRef(ce, "attrId")} and
        ${idRef(at)} = ${fieldRef(a, "typeId")};
`;
