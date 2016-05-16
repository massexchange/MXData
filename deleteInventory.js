var tempTable = require("./tempTable");

module.exports = mpId  => `
set @mpId = ${mpId};

delete from Catalog_Records where mpId = @mpId;

${tempTable("InvToDelete", `
	select id, sourceId
	from Inventory
	where mpId = @mpId
`)}

delete i
from
	Inventory i,
	InvToDelete i2d
where i.id = i2d.id;

delete ds, s
from
	Dfp_Inventory_Sources ds,
	Inventory_Sources s,
	InvToDelete i2d
where
	ds.id = s.id and
	s.id = i2d.sourceId;
`;
