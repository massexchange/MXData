var tempTable = require("./tempTable");

var protoAttrPred = `
	itri.taskId = @taskId and
	ri.id = itri.rawId and
	ripa.rawInvId = ri.id
`;

var selectRawsLike = (field, value) => `
	select ${field}
	from
		Import_Task_Raw_Inventory itri,
		Raw_Inventory ri,
		Raw_Inventory_ProtoAttrs ripa
	where
		${protoAttrPred} and
		type = "Dimension.AD_UNIT_NAME" and
		value like "${value}_%";
`;

var rawsToDelete = field => `
	select ${field}
	from Import_Task_Raw_Inventory itri
	where
		taskId = @taskId and
		rawId not in (select * from RawsToKeep);
`;

module.exports = taskId => `
set @taskId = ${taskId};

set @totalRaws = (select count(*) from Import_Task_Raw_Inventory);
set @relevantRaws = (select count(*) from Import_Task_Raw_Inventory where taskId = @taskId);

set @futbolRaws = (${selectRawsLike("count(*)", "FutbolMundial")});
set @beisbolRaws = (${selectRawsLike("count(*)", "BesibolMundial")});
set @vidaRaws = (${selectRawsLike("count(*)", "VidaLatina")});

${tempTable("RawsToKeep", selectRawsLike("ri.id", "FutbolMundial"))}
insert into RawsToKeep (${selectRawsLike("ri.id", "BeisbolMundial")});
insert into RawsToKeep (${selectRawsLike("ri.id", "VidaLatina")});

set @rawsToKeep = (select count(*) from RawsToKeep);
select @rawsToKeep = @futbolRaws + @beisbolRaws + @vidaRaws;

delete ripa
from
	Raw_Inventory_ProtoAttrs ripa,
	Import_Task_Raw_Inventory itri,
	Raw_Inventory ri
where
	${protoAttrPred} and
	ri.id not in (select * from RawsToKeep);

select count(*) from Import_Task_Raw_Inventory;
select count(*) from RawsToKeep;

set @rawsToDelete = (${rawsToDelete("count(*)")});

select @rawsToDelete;
select @rawsToDelete = @relevantRaws - @rawsToKeep;

${tempTable("RawsToDelete", rawsToDelete("itri.rawId id"))}
    
delete itri
from
	Import_Task_Raw_Inventory itri,
    RawsToDelete r2d
where
	taskId = @taskId and
	rawId = r2d.id;
    
delete ri
from
	Raw_Inventory ri,
    RawsToDelete r2d
where
	ri.id = r2d.i
`;
