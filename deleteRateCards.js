var tempTable = require("./tempTable");

module.exports = cardIds  => `
-- gather up relevant sections --

${tempTable("SectionsToDelete", `
	select id from Rate_Card_Sections
	where cardId in (${cardIds})
`)}

-- gather up relevant rows --

${tempTable("RowsToDelete", `
	select rowId id from Rate_Card_Rate_Card_Rows
	where cardId in (${cardIds})
`)}

insert into RowsToDelete (
	select rowId id from Rate_Card_Section_Rate_Card_Rows
	where sectionId in (select * from SectionsToDelete)
);

-- gather up relevant columns --

${tempTable("ColumnsToDelete", `
	select colId id from Rate_Card_Row_Rate_Card_Columns
	where rowId in (select * from RowsToDelete)
`)}

-- delete columns --

delete rcrrcc
from
	Rate_Card_Row_Rate_Card_Columns rcrrcc,
	ColumnsToDelete c2d
where rcrrcc.colId = c2d.id;

delete rcc
from
	Rate_Card_Columns rcc,
	ColumnsToDelete c2d
where rcc.id = c2d.id;

-- delete rows --

delete rcsrcr
from
	Rate_Card_Rate_Card_Rows rcsrcr,
	RowsToDelete r2d
where rcsrcr.rowId = r2d.id;

delete rcrcr
from
	Rate_Card_Rate_Card_Rows rcrcr,
	RowsToDelete r2d
where rcrcr.rowId = r2d.id;

delete rcr
from
	Rate_Card_Rows rcr,
	RowsToDelete r2d
where rcr.id = r2d.id;

-- delete sections --

delete rcs
from
	Rate_Card_Sections rcs,
	SectionsToDelete s2d
where rcs.id = s2d.id;

-- delete cards --

delete from	Rate_Cards
where id in (${cardIds});
`;
