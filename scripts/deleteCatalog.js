const
    { sql, deletionTables } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["Cat", "Orders"];
const tables = deletionTables(entities);

module.exports = mpId  => sql`
    -- gather up relevant catRecs --
    ${tempTable(tables.cat.name).fromQuery(sql`
        select id, pricingId
        from Catalog_Records
        where mpId = ${mpId}
    `)}

    -- delete relevant orders --

    ${tempTable(tables.orders.name).fromQuery(sql`
        select id from Sell_Orders
        where catRecId in (select id from ${tables.cat.name})
    `)}

    ${tables.orders.deleteWith("Sell_Orders")}
    ${tables.orders.deleteWith("Orders")}

    -- delete pricing and records --
    ${tables.cat.deleteWith("Catalog_Records")}

    ${tables.cat.deleteWith("Pricing_Schedule_APAR_Prices",
        "pricingScheduleId", "pricingId")}

    ${tables.cat.deleteWith("Pricing_Schedules",
        "id", "pricingId")}
`;
