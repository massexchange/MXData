var formatProtoAttr = table => `concat(${table}}.key, ':', ${table}.value)`;

module.exports = mpId =>`
select
	im.id mappingId,
	${formatProtoAttr("im")} input,
	coalesce(
		group_concat(
			${formatProtoAttr("imo")}
			order by imo.key, imo.value asc
			separator '  |  '
		),
		"DELETE"
	) output
from Import_Mappings im
	left join Import_Mappings_Outputs imo on im.id = imo.mappingId
where mpId = ${mpId}
group by im.id
order by input, output, count(imo.key);
`;
