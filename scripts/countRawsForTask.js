const
    { sql } = require("../helpers/util");

module.exports = taskId => sql`
    select count(*)
    from Import_Task_Raw_Inventory
    where taskId = ${taskId};
`;
