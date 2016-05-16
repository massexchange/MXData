var instrumentsWithAttr = require("./instrumentsWithAttr");

module.exports = attrId => `
select * from Inventory i
where instId in (${instrumentsWithAttr(attrId)});
`;
