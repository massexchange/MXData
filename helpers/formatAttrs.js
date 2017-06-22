const
    { sql } = require("./util");

module.exports = (nameField = "name", valueField = "value", showId = true) => sql`
    group_concat(
        ${nameField}, ':',
        ${valueField}
        ${showId ? ", ' (', attrId, ')'" : ""}
        order by ${nameField} asc
        separator '  |  '
    )`;
