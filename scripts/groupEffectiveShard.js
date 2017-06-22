const
    { sql } = require("../helpers/util"),
    formatAttrs = require("../helpers/formatAttrs");

module.exports = mpId => sql`
    select cg.id groupId,
       (select ${formatAttrs()} attributes
        from
            Shards sh,
            Instrument_Attributes ia,
            Attributes a,
            Attribute_Types at
        where
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
