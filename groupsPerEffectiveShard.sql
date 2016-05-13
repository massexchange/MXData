-- these should all be 1, otherwise you've got a problem
select ga.attributes, count(ga.groupId) groups
from (select cg.id groupId,
	   (select group_concat(name, ':', value order by name asc separator '  |  ') attributes
		from Shards sh, Instrument_Attributes ia, Attributes a, Attribute_Types at
		where ia.instId = sh.instId
		and ia.attrId not in (select attrId from Shard_Hidden_Attributes sha where sha.shardId = sh.id)
		and ia.attrId = a.id
		and a.typeId = at.id
		and sh.id = cg.shardId
		group by sh.id
	) attributes
	from Catalog_Groups cg
	where mpId = {mpId}
) ga
group by attributes;