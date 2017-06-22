const
    { sql } = require("./util");

module.exports = dateField => sql`
    concat(
        month(${dateField}), "/",
        day(${dateField}), "/",
        year(${dateField})
    )`;
