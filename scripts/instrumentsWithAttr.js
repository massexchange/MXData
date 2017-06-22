const
    { sql } = require("../helpers/util");

module.exports = attrId => sql`
    select instId
    from Instrument_Attributes
    where attrId = ${attrId};
`;
