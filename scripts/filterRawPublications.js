const
    { sql, table, alias, deletionTables } = require("../helpers/util"),
    tempTable = require("../helpers/tempTable");

const entities = ["KeepRaws", "Raws"];
const tables = deletionTables(entities);

var protoAttrPred = sql`
    itri.taskId = @taskId and
    ri.id = itri.rawId and
    ripa.rawInvId = ri.id
`;

var selectRawsLike = (field, value) => sql`
    select ${field}
    from
        Import_Task_Raw_Inventory itri,
        Raw_Inventory ri,
        Raw_Inventory_ProtoAttrs ripa
    where
        ${protoAttrPred} and
        type = "Dimension.AD_UNIT_NAME" and
        value like ${value}_%;
`;

var rawsToDelete = field => sql`
    select ${field}
    from Import_Task_Raw_Inventory itri
    where
        taskId = @taskId and
        rawId not in (select * from ${tables.keepraws.name});
`;

module.exports = taskId => sql`
    set @taskId = ${taskId};

    set @totalRaws = (select count(*) from Import_Task_Raw_Inventory);
    set @relevantRaws = (
        select count(*)
        from Import_Task_Raw_Inventory
        where taskId = @taskId);

    set @futbolRaws = (
        ${selectRawsLike("count(*)", "FutbolMundial")}
    );
    set @beisbolRaws = (${selectRawsLike("count(*)", "BesibolMundial")});
    set @vidaRaws = (${selectRawsLike("count(*)", "VidaLatina")});

    ${tempTable(tables.keepraws.name).fromQuery(
        selectRawsLike("ri.id", "FutbolMundial"))}
    insert into ${tables.keepraws.name} (
        ${selectRawsLike("ri.id", "BeisbolMundial")}
    );
    insert into ${tables.keepraws.name} (
        ${selectRawsLike("ri.id", "VidaLatina")}
    );

    set @rawsToKeep = (select count(*) from ${tables.keepraws.name});
    select @rawsToKeep = @futbolRaws + @beisbolRaws + @vidaRaws;

    delete ripa
    from
        Raw_Inventory_ProtoAttrs ripa,
        Import_Task_Raw_Inventory itri,
        Raw_Inventory ri
    where
        ${protoAttrPred} and
        ri.id not in (select * from ${tables.keepraws.name});

    select count(*) from Import_Task_Raw_Inventory;
    select count(*) from ${tables.keepraws.name};

    set @rawsToDelete = (${rawsToDelete("count(*)")});

    select @rawsToDelete;
    select @rawsToDelete = @relevantRaws - @rawsToKeep;

    ${tempTable(tables.raws.name).fromQuery(
        rawsToDelete("itri.rawId id"))}

    delete itri
    from
        Import_Task_Raw_Inventory itri,
        ${table(tables.raws.name)}
    where
        taskId = @taskId and
        rawId = ${alias(tables.raws.name)}.id;

    ${tables.raws.deleteWith("Raw_Inventory")}
`;
