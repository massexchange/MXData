const
    { sql, deletionTables } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["Collapsed"];
const tables = deletionTables(entities);

module.exports = mpId => sql`
    set @mpId = ${mpId};

    ${tempTable(tables.collapsed.name).fromQuery(sql`
        select id from Collapsed_Catalog_Records
        where mpId = @mpId
    `)}

    ${tables.collapsed.deleteWith("Collapsed_Catalog_Record_Catalog_Records",
        "collCatRecId")}

    ${tables.collapsed.deleteWith("Catalog_Group_Collapsed_Catalog_Records",
        "collCatRecId")}

    ${tables.collapsed.deleteWith("Collapsed_Catalog_Records")}

    delete from Catalog_Groups
    where mpId = @mpId;
`;
