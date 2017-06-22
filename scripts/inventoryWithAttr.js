const
    { sql } = require("../helpers/util"),
    instrumentsWithAttr = require("./instrumentsWithAttr");

module.exports = attrId => sql`
    select * from Inventory i
    where instId in (
        ${instrumentsWithAttr(attrId)}
    );
`;
