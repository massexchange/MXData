const
    util = require("./util"),
    tempTable = require("./tempTable");

const { sql, table,
    deleteWhereFieldInTable,
    deleteWhereFieldsInTable } = util;

const deletionTable = name => `${name}ToDelete`;

const typesTable = deletionTable("Types");
const attrsTable = deletionTable("Attrs");
const cachesTable = deletionTable("Caches");
const groupsTable = deletionTable("UnitTypesGroups");

const deleteWhereFieldsinAttrsTable = deleteWhereFieldsInTable(attrsTable);
const deleteWhereFieldsinTypesTable = deleteWhereFieldsInTable(typesTable);
const deleteWhereFieldsinGroupsTable = deleteWhereFieldsInTable(groupsTable);

const selectIdWhereFieldInTypesTable = util.selectIdsWhereFieldInTable(typesTable);

module.exports = (...typeIds) => sql`
${tempTable(typesTable).fromData(sql`
    id int(10) unsigned not null`, typeIds)}

${tempTable(cachesTable).fromQuery(
    selectIdWhereFieldInTypesTable(
        "Attribute_Caches", "attrTypeId"))}

${deleteWhereFieldInTable("Cache_Elements",
    "attrCacheId", cachesTable)}

${deleteWhereFieldInTable("Attribute_Caches",
    "id", cachesTable)}

${tempTable(attrsTable).fromQuery(
    selectIdWhereFieldInTypesTable(
        "Attributes", "typeId"))}

${deleteWhereFieldsinAttrsTable("Instrument_Attributes",
    "attrId")}

${deleteWhereFieldsinAttrsTable("Shard_Hidden_Attributes",
    "attrId")}

${deleteWhereFieldsinAttrsTable("Attributes", "id")}

${deleteWhereFieldsinTypesTable("Attribute_Type_Dependencies",
    "parentTypeId", "childTypeId")}

${deleteWhereFieldsinTypesTable("Unit_Type_Attribute_Types",
    "attrTypeId")}

${tempTable(groupsTable).fromQuery(
    selectIdWhereFieldInTypesTable(
        "Unit_Type_Groups", "attributeTypeId"))}

${deleteWhereFieldsinGroupsTable("Unit_Type_Group_Unit_Types",
    "groupId")}

${deleteWhereFieldsinGroupsTable("Unit_Type_Groups", "id")}

${deleteWhereFieldInTable("Attribute_Types",
    "id", typesTable)}

`;
