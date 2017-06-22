const
    { sql } = require("../helpers/util"),
    viewCatalog = require("./viewCatalog");

module.exports = mpId => sql`
    ${viewCatalog(mpId, "Catalog_Groups", "cg")}
    order by count(name), attributes;
`;
