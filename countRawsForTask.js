module.exports = taskId => `
select count(*)
from Import_Task_Raw_Inventory
where taskId = ${taskId};`;
