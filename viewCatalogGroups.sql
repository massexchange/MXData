select
    cg.id groupId,
    cg.mpId mpId,
    group_concat(name, ':', value order by name asc separator '  |  ') attributes
from
    Catalog_Groups cg,
    Shards sh,
    Instrument_Attributes ia,
    Attributes a,
    Attribute_Types at
where
    mpId = 8 and
	cg.shardId = sh.id and
    sh.instId = ia.instId and
    a.id not in (select attrId from Shard_Hidden_Attributes where shardId = sh.id) and
    ia.attrId = a.id and
    a.typeId = at.id
group by groupId