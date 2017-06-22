const
    { sql, deletionTables } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["Mappings"];
const tables = deletionTables(entities);

module.exports = mappingKey => sql`
    set @mappingKey = ${mappingKey};

    ${tempTable(tables.mappings.name).fromQuery(sql`
        select id from Import_Mappings
        where \`key\` = @mappingKey
    `)}

    ${tables.mappings.name("Import_Mappings_Outputs",
        "mappingId")}

    ${tables.mappings.name("Import_Mappings")}
`;
