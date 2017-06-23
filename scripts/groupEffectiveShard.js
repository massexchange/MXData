const
    { sql, aliases, fromTables } = require("../helpers/util"),
    formatAttrs = require("../helpers/formatAttrs");

const entities = [
    "Shards",
    "Instrument_Attributes",
    "Attributes",
    "Attribute_Types"];
const { s, ia, a, at } = aliases(entities);

module.exports = mpId => sql`
    select cg.id groupId, (
       select ${formatAttrs()} attributes
        ${fromTables(entities)}
        where
            //TODO: continue from here
            ia.instId = sh.instId and
            ia.attrId not in (
                select attrId
                from Shard_Hidden_Attributes sha
                where sha.shardId = sh.id
            ) and
            ia.attrId = a.id and
            a.typeId = at.id and
            sh.id = cg.shardId
        group by sh.id
    ) attributes
    from Catalog_Groups cg
    where mpId = ${mpId}
    order by groupId, attributes asc;
`;
