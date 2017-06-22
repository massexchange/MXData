const
    { sql, alias, table, fieldRef, idRef, entriesToMap } = require("../helpers/util"),
    formatDate = require("../helpers/formatDate"),
    formatAttrs = require("../helpers/formatAttrs");

const entities = ["Inventory", "Instrument_Attributes", "Attributes", "Attribute_Types"];

const tables = entities
    .map(entity =>
        [alias(entity), entity])
    .reduce(entriesToMap, {});

module.exports = mpId => sql`
    select
        ${idRef(tables.i)} invId,
        ${formatDate("date")} day,
        ${formatAttrs()} attributes
    from
        ${entities.map(table).join(", \n")}
    where
        ${fieldRef(tables.i, "mpId")} = ${mpId} and
        ${fieldRef(tables.i, "instId")} = ${fieldRef(tables.ia, "instId")} and
        ${fieldRef(tables.ia, "attrId")} = ${idRef(tables.a)} and
        ${fieldRef(tables.a, "typeId")} = ${idRef(tables.at)}
    group by invId
    order by date asc;
`;
