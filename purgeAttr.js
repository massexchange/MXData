var inventoryWithAttr = require("./inventoryWithAttr");

module.exports = attrId => `
set @attrId = ${attrId};

delete from Instrument_Attributes where attrId = @attrId;
delete from Shard_Hidden_Attributes where attrId = @attrId;

delete from MassExchange.Cache_Elements where attrId = @attrId;

delete from Attributes where id = @attrId;

-- should not return anything
${inventoryWithAttr(attrId)}
`;

module.exports.type = "DML";
