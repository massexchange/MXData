var tempTable = require("./tempTable");

var sql = String.raw;

module.exports = mpId  => `
set @mpId = ${mpId};

-- gather up relevant catRecs --

${tempTable("CatToDelete", `
	select id, inventoryId from Catalog_Records
	where mpId = @mpId
`)}


-- delete relevant orders --

${tempTable("OrdersToDelete", `
	select id from Sell_Orders
	where catRecId in (select id from CatToDelete)
`)}

delete so
from
	Sell_Orders so,
	OrdersToDelete o2d
where so.id = o2d.id;

delete o
from
	Orders o,
	OrdersToDelete o2d
where o.id = o2d.id;


-- delete pricing and records --

delete cp
from
	Catalog_Record_Pricing_Schedules cp,
	CatToDelete c2d
where cp.catRecId = c2d.id;

delete from Pricing_Schedules
where id in (
	select pricingId
	from Catalog_Record_Pricing_Schedules
	where catRecId in (select id from CatToDelete)
);

delete c
from
	Catalog_Records c,
	CatToDelete c2d
where c.id = c2d.id;


-- delete inventory and sources --

${tempTable("InvToDelete", `
	select id, sourceId
	from Inventory
	where id in (
		select inventoryId from CatToDelete
	)
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
