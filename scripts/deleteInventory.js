const
    { sql, alias, aliases, deleteWhere, idRef, deletionTables } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["Cat", "Orders", "Inventory"];
const { cat, orders, inventory } = deletionTables(entities);

const entities = [
    "Dfp_Inventory_Sources",
    "Inventory_Sources"];
const { dis, is } = aliases(entities);

module.exports = mpId  => sql`
    set @mpId = ${mpId};

    -- gather up relevant catRecs --
    ${tempTable(cat.name).fromQuery(sql`
        select id, inventoryId
        from Catalog_Records
        where mpId = @mpId
    `)}

    -- delete relevant orders --

    ${tempTable(orders.name).fromQuery(sql`
        select id from Sell_Orders
        where catRecId in (
            select id from ${cat.name})
    `)}

    ${orders.deleteWith("Sell_Orders")}

    ${orders.deleteWith("Orders")}

    -- delete pricing and records --

    ${cat.deleteWith("Catalog_Record_Pricing_Schedules",
        "catRecId")}

    delete from Pricing_Schedules
    where id in (
        select pricingId
        from Catalog_Record_Pricing_Schedules
        where catRecId in (select id from ${cat.name})
    );

    ${cat.deleteWith("Catalog_Records")}

    -- delete inventory and sources --

    ${tempTable(inventory.name).fromQuery(sql`
        select id, sourceId
        from Inventory
        where id in (
            select inventoryId from ${cat.name}
        )
    `)}

    ${inventory.deleteWith("Inventory")}

    ${deleteWhere([dis, is], sql`
        ${idRef(dis)} = ${idRef(is)} and
        ${idRef(is)} = ${alias(inventory.name)}.sourceId
    `, inventory.name)}
`;
