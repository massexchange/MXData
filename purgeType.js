var tempTable = require("./tempTable");

module.exports = typeId => `
set @typeId = ${typeId};

set @cacheId = (
	select id from Attribute_Caches
	where attrTypeId = @typeId
);

delete from Cache_Elements
where attrCacheId = @cacheId;

delete from Attribute_Caches
where id = @cacheId;

${tempTable("AttrsToDelete", `
	select id from Attributes
	where typeId = @typeId
`)}

delete ia
from
	Instrument_Attributes ia,
	AttrsToDelete a2d
where ia.attrId = a2d.id;

delete sha
from
	Shard_Hidden_Attributes sha,
	AttrsToDelete a2d
where sha.attrId = a2d.id;

delete a
from
	Attributes a,
	AttrsToDelete a2d
where a.id = a2d.id;

delete from Attribute_Types
where id = @typeId;
`;
