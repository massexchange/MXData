const
    { sql, table, fieldRef, idRef } = require("../helpers/util");

var formatProtoAttr = table => sql`
    concat(${table}.key, ':', ${table}.value)`;

const im = "Import_Mappings";
const imo = "Import_Mappings_Outputs";

module.exports = mpId => sql`
    select
        ${idRef(im)} mappingId,
        ${formatProtoAttr("im")} input,
        coalesce(
            group_concat(
                ${formatProtoAttr("imo")}
                order by ${fieldRef(imo, "key")}, ${fieldRef(imo, "value")} asc
                separator '  |  '
            ),
            "delete"
        ) output
    from ${table(im)}
        left join ${table()}
            on ${idRef(im)} = ${fieldRef(imo, "mappingId")}
    where mpId = ${mpId}
    group by ${idRef(im)}
    order by input, output, count(${fieldRef(imo, "key")});
`;
