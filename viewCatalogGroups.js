var viewCatalog = require("./viewCatalog");

module.exports = mpId => `
${viewCatalog(mpId, "Catalog_Groups", "cg")}
order by count(name), attributes;
`;
