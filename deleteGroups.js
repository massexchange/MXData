var tempTable = require("./tempTable");

module.exports = mpId => `
SET @mpId = ${mpId};

${tempTable("CollapsedToDelete", `
	select id from Collapsed_Catalog_Records
	where mpId = @mpId
`)}

delete ccrcr
from
	Collapsed_Catalog_Record_Catalog_Records ccrcr,
	CollapsedToDelete c2d
where ccrcr.collCatRecId = c2d.id;

delete cgccr
from
	Catalog_Group_Collapsed_Catalog_Records cgccr,
	CollapsedToDelete c2d
where cgccr.collCatRecId = c2d.id;

delete ccr
from
	Collapsed_Catalog_Records ccr,
	CollapsedToDelete c2d
where ccr.id = c2d.id;

delete from Catalog_Groups where mpId = @mpId;
`;
