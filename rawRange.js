var dateRange = require("./dateRange"),
	tempTable = require("./tempTable");

module.exports = taskId => `
${tempTable("RawIds", `
	select rawId
	from Import_Task_Raw_Inventory
	where taskId = ${taskId}
`)}

${dateRange(
	"Raw_Inventory",
	alias => `${alias}.id in (select id from RawIds)`
)}
`;
