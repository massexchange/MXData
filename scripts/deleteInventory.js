const
    { sql, alias, table, deletionTables } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["Cat", "Orders", "Inventory"];
const tables = deletionTables(entities);

module.exports = mpId  => sql`
    set @mpId = ${mpId};

    -- gather up relevant catRecs --
    ${tempTable(tables.cat.name).fromQuery(sql`
        select id, inventoryId
        from Catalog_Records
        where mpId = @mpId
    `)}

    -- delete relevant orders --

    ${tempTable(tables.orders.name).fromQuery(sql`
        select id from Sell_Orders
        where catRecId in (
            select id from ${tables.cat.name})
    `)}

    ${tables.orders.deleteWith("Sell_Orders")}

    ${tables.orders.deleteWith("Orders")}

    -- delete pricing and records --

    ${tables.cat.deleteWith("Catalog_Record_Pricing_Schedules",
        "catRecId")}

    delete from Pricing_Schedules
    where id in (
        select pricingId
        from Catalog_Record_Pricing_Schedules
        where catRecId in (select id from ${tables.cat.name})
    );

    ${tables.cat.deleteWith("Catalog_Records")}

    -- delete inventory and sources --

    ${tempTable(tables.inventory.name).fromQuery(sql`
        select id, sourceId
        from Inventory
        where id in (
            select inventoryId from ${tables.cat.name}
        )
    `)}

    ${tables.inventory.deleteWith("Inventory")}

    delete ds, s
    from
        Dfp_Inventory_Sources ds,
        Inventory_Sources s,
        ${table(tables.inventory.name)}
    where
        ds.id = s.id and
        s.id = ${alias(tables.inventory.name)}.sourceId;
`;
