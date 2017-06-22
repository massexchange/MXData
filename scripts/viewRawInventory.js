const
    { sql, table, alias, fieldRef, idRef } = require("../helpers/util"),
    formatDate = require("../helpers/formatDate"),
    formatAttrs = require("../helpers/formatAttrs");

//TODO: finish this
module.exports = taskId => sql`
    select
        ${idRef(ri)} rawId,
        ${formatDate("date")} day,
        ${formatAttrs("`key`", "value", false)} attributes
    from
        ${table("Raw_Inventory")},
        ${table("Raw_Inventory_ProtoAttrs")}
    where
        ri.id in (
            select rawId
            from Import_Task_Raw_Inventory
            where taskId = ${taskId}
        ) and
        ripa.rawInvId = ri.id
    group by rawId
    order by date asc;
`;
