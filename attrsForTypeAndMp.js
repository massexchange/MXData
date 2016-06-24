module.exports = (typeId, mpId) => `
select a.id id, name, value
from Cache_Elements ce, Attributes a, Attribute_Types at
where
	attrCacheId in (
		select id from Attribute_Caches
		where mpId = @${mpId} and attrTypeId = ${typeId}
	) and
    a.id = ce.attrId and
    at.id = a.typeId;
`;
