const
    { sql } = require("../helpers/util"),
    inventoryWithAttr = require("./inventoryWithAttr");

module.exports = attrId => sql`
    set @attrId = ${attrId};

    delete from Instrument_Attributes
    where attrId = @attrId;

    delete from Shard_Hidden_Attributes
    where attrId = @attrId;

    delete from Cache_Elements
    where attrId = @attrId;

    delete from Attribute_Dependencies
    where
        childId = @attrId or
        parentId = @attrId;

    delete from Attributes
    where id = @attrId;

    -- should not return anything
    ${inventoryWithAttr(attrId)}
`;

module.exports.type = "DML";
