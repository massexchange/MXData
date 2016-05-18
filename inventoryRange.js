var dateRange = require("./dateRange");

module.exports = mpId => dateRange(
	"Inventory",
	alias => `${alias}.mpId = ${mpId}`
);
