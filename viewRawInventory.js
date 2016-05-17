var formatDate = require("./formatDate"),
    formatAttrs = require("./formatAttrs");

module.exports = taskId => `
select
    ri.id rawId,
    ${formatDate("date")} day,
    ${formatAttrs("`key`", "value", false)} attributes
from
    Raw_Inventory ri,
    Raw_Inventory_ProtoAttrs ripa
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
