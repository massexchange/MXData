const
    { sql } = require("../helpers/util"),
    formatAttrs = require("../helpers/formatAttrs");

module.exports = (mpId, table, alias) => sql`
    select
        ${alias}.id id,
        ${formatAttrs()} attributes
    from
        ${table} ${alias},
        Shards sh,
        Instrument_Attributes ia,
        Attributes a,
        Attribute_Types at
    where
        mpId = ${mpId} and
    	${alias}.shardId = sh.id and
        sh.instId = ia.instId and
        a.id not in (
            select attrId
            from Shard_Hidden_Attributes
            where shardId = sh.id
        ) and
        ia.attrId = a.id and
        a.typeId = at.id
    group by id;
`;
