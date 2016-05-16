var tempTable = require("./tempTable");

module.exports = mappingKey => `
set @mappingKey = ${mappingKey};

${tempTable("MappingsToDelete", `
	select id from Import_Mappings
	where \`key\` = @mappingKey
`)}

delete imo
from
	Import_Mappings_Outputs imo,
	MappingsToDelete m2d
where imo.mappingId = m2d.id;

delete im
from
	Import_Mappings im,
	MappingsToDelete m2d
where im.id = m2d.id;
`;
