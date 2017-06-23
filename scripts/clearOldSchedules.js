const
    { sql, deleteWhere, fieldRef, idRef } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const prices = "Pricing_Schedule_APAR_Prices";
const schedules = "Pricing_Schedules";
const used = "UsedSchedules";

module.exports = () => sql`
    ${tempTable(used).fromQuery(sql`
        select pricingId from Catalog_Records
        where pricingId is not null
    `)}

    ${deleteWhere(prices, sql`
        ${fieldRef(prices, "pricingScheduleId")} not in (
            select * from ${used}
        )
    `, "thing")}

    ${deleteWhere(schedules, sql`
        ${idRef(schedules)} not in (
            select * from ${used}
        )
    `)}
`;
