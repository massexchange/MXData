const
    { sql, deletionTables,
        selectWhereFieldInTable } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["Types", "Attrs", "Caches", "Groups"];
const tables = deletionTables(entities);

const selectWhereFieldInTypesTable = selectWhereFieldInTable(tables.types.name);

module.exports = (...typeIds) => sql`
    ${tempTable(tables.types.name).fromData(sql`
        id int(10) unsigned not null`, typeIds)}

    ${tempTable(tables.groups.name).fromQuery(
        selectWhereFieldInTypesTable(
            "Unit_Type_Groups", "attributeTypeId"))}

    ${tempTable(tables.caches.name).fromQuery(
        selectWhereFieldInTypesTable(
            "Attribute_Caches", "attrTypeId",
            ["id", "attrTypeId"]))}

    ${tables.groups.deleteWith("Cache_Elements",
        "attrCacheId")}

    ${tables.groups.deleteWith("Attribute_Caches")}

    ${tempTable(tables.attrs.name).fromQuery(
        selectWhereFieldInTypesTable(
            "Attributes", "typeId"))}

    ${tables.attrs.deleteWith("Instrument_Attributes",
        "attrId")}

    ${tables.attrs.deleteWith("Shard_Hidden_Attributes",
        "attrId")}

    ${tables.attrs.deleteWith("Attributes")}

    ${tables.types.deleteWith("Attribute_Type_Dependencies",
        ["parentTypeId", "childTypeId"])}

    ${tables.types.deleteWith("Unit_Type_Attribute_Types",
        "attrTypeId")}

    ${tables.groups.deleteWith("Unit_Type_Group_Unit_Types",
        "groupId")}

    ${tables.groups.deleteWith("Unit_Type_Groups")}

    ${tables.types.deleteWith("Attribute_Types",
        "id")}
`;
