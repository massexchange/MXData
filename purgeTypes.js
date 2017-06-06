const tempTable = require("./tempTable");

const sql = String.raw;

const deleteWhere = (table, condition) => sql`
    delete from ${table}
    where ${condition}
`;

const fieldInTable = (field, table) => sql`
    ${field} in (select * from ${table})`;

const selectIdsWhereFieldInTable = memberTable => (table, field) => sql`
    select id from ${table}
    where ${fieldInTable(field, memberTable)}
`;

const deleteWhereFieldInTable = (table, field, memberTable) =>
    deleteWhere(table,
        fieldInTable(field, memberTable));

const typesTable = "TypesToDelete";
const attrsTable = "AttrsToDelete";
const cachesTable = "CachesToDelete";
const groupsTable = "UnitTypesGroupsToDelete";

const selectIdWhereFieldInTypesTable = selectIdsWhereFieldInTable(typesTable);

const alias = tableName =>
    tableName
        .split("_")
        .map(part => part[0].toLowerCase())
        .join("");

const table = name => sql`
    ${name} ${alias(name)}`;

const fieldRef = (table, name) => sql`
    ${alias(table)}.${name}`;

const deleteWhereFieldsInTable = memberTable => (targetTable, ...fields) => sql`
    delete ${alias(targetTable)}
    from
        ${table(targetTable)},
        ${table(memberTable)}
    where ${
        fields.map(field => sql`
            ${fieldRef(targetTable, field)} = ${fieldRef(memberTable, "id")}
        `).join(" or\n")
    };
`;

const deleteWhereFieldsinAttrsTable = deleteWhereFieldsInTable(attrsTable);
const deleteWhereFieldsinTypesTable = deleteWhereFieldsInTable(typesTable);
const deleteWhereFieldsinGroupsTable = deleteWhereFieldsInTable(groupsTable);

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
