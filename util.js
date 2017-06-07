const
    { stripIndent } = require("common-tags"),
    outdent = require("outdent");

const util = {};

const sql = util.sql = outdent;

util.deleteWhere = (table, condition) => sql`
    delete from ${table}
    where ${condition}
`;

util.fieldInTable = (field, table) => sql`
    ${field} in (select * from ${table})`;

util.selectIdsWhereFieldInTable = memberTable => (table, field) => sql`
    select id from ${table}
    where ${util.fieldInTable(field, memberTable)}
`;

util.deleteWhereFieldInTable = (table, field, memberTable) =>
    util.deleteWhere(table,
        util.fieldInTable(field, memberTable));

util.alias = tableName =>
    tableName
        .split("_")
        .map(part => part[0].toLowerCase())
        .join("");

util.table = name => sql`
    ${name} ${util.alias(name)}`;

util.fieldRef = (table, name) => sql`
    ${util.alias(table)}.${name}`;

util.deleteWhereFieldsInTable = memberTable => (targetTable, ...fields) => sql`
    delete ${util.alias(targetTable)}
    from
        ${util.table(targetTable)},
        ${util.table(memberTable)}
    where ${
        fields.map(field => sql`
            ${util.fieldRef(targetTable, field)} = ${util.fieldRef(memberTable, "id")}
        `).join(" or\n")
    };
`;

module.exports = util;
