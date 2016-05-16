var viewCatalog = require("./viewCatalog");

module.exports = mpId => `
${viewCatalog(mpId, "Catalog_Records", "cr")}
`;
