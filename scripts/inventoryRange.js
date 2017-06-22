const dateRange = require("../helpers/dateRange");

module.exports = mpId => dateRange(
    "Inventory",
    alias => `${alias}.mpId = ${mpId}`
);
