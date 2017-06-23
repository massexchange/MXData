const
    { sql, table, aliases, idRef, fieldRef, deletionTables, fromTables, deleteWhere } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["KeepRaws", "Raws"];
const { keepraws, raws } = deletionTables(entities);

const entities = [
    "Raw_Inventory_ProtoAttrs",
    "Import_Task_Raw_Inventory",
    "Raw_Inventory"];
const { rip, itri, ri } = aliases(entities);

var protoAttrPred = sql`
    ${fieldRef(itri, "taskId")} = @taskId and
    ${idRef(ri)} = ${fieldRef(itri, "rawId")} and
    ${fieldRef(rip, "rawInvId")} = ${idRef(ri)}
`;

var selectRawsLike = (field, value) => sql`
    select ${field}
    ${fromTables(entities)}
    where
        ${protoAttrPred} and
        type = "Dimension.AD_UNIT_NAME" and
        value like ${value}_%;
`;

var rawsToDelete = field => sql`
    select ${field}
    from ${table(itri)}
    where
        taskId = @taskId and
        rawId not in (select * from ${keepraws.name});
`;

module.exports = taskId => sql`
    set @taskId = ${taskId};

    set @totalRaws = (select count(*) from ${itri});
    set @relevantRaws = (
        select count(*)
        from ${itri}
        where taskId = @taskId);

    set @futbolRaws = (
        ${selectRawsLike("count(*)", "FutbolMundial")}
    );
    set @beisbolRaws = (${selectRawsLike("count(*)", "BesibolMundial")});
    set @vidaRaws = (${selectRawsLike("count(*)", "VidaLatina")});

    ${tempTable(keepraws.name).fromQuery(
        selectRawsLike(idRef(ri), "FutbolMundial"))}
    insert into ${keepraws.name} (
        ${selectRawsLike(idRef(ri), "BeisbolMundial")}
    );
    insert into ${keepraws.name} (
        ${selectRawsLike(idRef(ri), "VidaLatina")}
    );

    set @rawsToKeep = (select count(*) from ${keepraws.name});
    select @rawsToKeep = @futbolRaws + @beisbolRaws + @vidaRaws;

    ${deleteWhere(rip, sql`
        ${protoAttrPred} and
        ${idRef(ri)} not in (
            select * from ${keepraws.name}
        )
    `, [itri, ri])}

    select count(*) from ${itri};
    select count(*) from ${keepraws.name};

    set @rawsToDelete = (${rawsToDelete("count(*)")});

    select @rawsToDelete;
    select @rawsToDelete = @relevantRaws - @rawsToKeep;

    ${tempTable(raws.name).fromQuery(
        rawsToDelete(`${fieldRef(itri, "rawId")} id`))}

    ${deleteWhere(itri, sql`
        taskId = @taskId and
        rawId = ${idRef(raws.name)}
    `, raws.name)}

    ${raws.deleteWith("Raw_Inventory")}
`;
