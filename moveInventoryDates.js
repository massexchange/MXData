var addMonths = (dateField, months) => `date_add(${dateField}, interval ${months} month)`;

module.exports = (mpId, monthOffset) => `
set @mpId = ${mpId};

update Inventory
set date = ${addMonths("date", monthOffset)}
where mpId = @mpId;

update Collapsed_Catalog_Records
set
	startDate = ${addMonths("startDate", monthOffset)},
	endDate = ${addMonths("endDate", monthOffset)}
where mpId = @mpId;
`;
