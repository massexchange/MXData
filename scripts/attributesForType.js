const
    { sql } = require("../helpers/util");

module.exports = typeId => sql`
    select * from Attributes
    where typeId = ${typeId};
`;
