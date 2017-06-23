const
    { sql, deletionTables } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["Cat", "Orders"];
const { cat, orders } = deletionTables(entities);

module.exports = mpId  => sql`
    -- gather up relevant catRecs --
    ${tempTable(cat.name).fromQuery(sql`
        select id, pricingId
        from Catalog_Records
        where mpId = ${mpId}
    `)}

    -- delete relevant orders --

    ${tempTable(orders.name).fromQuery(sql`
        select id from Sell_Orders
        where catRecId in (select id from ${cat.name})
    `)}

    ${orders.deleteWith("Sell_Orders")}
    ${orders.deleteWith("Orders")}

    -- delete pricing and records --
    ${cat.deleteWith("Catalog_Records")}

    ${cat.deleteWith("Pricing_Schedule_APAR_Prices",
        "pricingScheduleId", "pricingId")}

    ${cat.deleteWith("Pricing_Schedules",
        "id", "pricingId")}
`;
