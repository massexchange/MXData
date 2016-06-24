var deleteGroups = require("./deleteGroups");
var deleteCatalog = require("./deleteCatalog");
var deleteInventory = require("./deleteInventory");

module.exports = mpId => `
${deleteGroups(mpId)}
${deleteCatalog(mpId)}
${deleteInventory(mpId)}
`;
