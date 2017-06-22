const
    { sql, table, aliases, fieldRef, idRef } = require("../helpers/util");

var formatProtoAttr = table => sql`
    concat(${table}.key, ':', ${table}.value)`;

const entities = ["Import_Mappings", "Import_Mappings_Outputs"];
const tables = aliases(entities);

module.exports = mpId => sql`
    select
        ${idRef(tables.im)} mappingId,
        ${formatProtoAttr("im")} input,
        coalesce(
            group_concat(
                ${formatProtoAttr("imo")}
                order by ${fieldRef(tables.imo, "key")}, ${fieldRef(tables.imo, "value")} asc
                separator '  |  '
            ),
            "delete"
        ) output
    from ${table(tables.im)}
        left join ${table(tables.imo)}
            on ${idRef(tables.im)} = ${fieldRef(tables.imo, "mappingId")}
    where mpId = ${mpId}
    group by ${idRef(tables.im)}
    order by input, output, count(${fieldRef(tables.imo, "key")});
`;
