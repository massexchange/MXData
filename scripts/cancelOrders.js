const
    { sql } = require("../helpers/util");

module.exports = mpId => sql`
    update Orders
    set status = "Cancelled"
    where mpId = ${mpId};
`;
