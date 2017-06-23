const
    { sql, deletionTables } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["Mappings"];
const { mappings } = deletionTables(entities);

module.exports = mappingKey => sql`
    set @mappingKey = ${mappingKey};

    ${tempTable(mappings.name).fromQuery(sql`
        select id from Import_Mappings
        where \`key\` = @mappingKey
    `)}

    ${mappings.name("Import_Mappings_Outputs",
        "mappingId")}

    ${mappings.name("Import_Mappings")}
`;
