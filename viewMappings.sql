select
	im.id mappingId,
	mpId,
	concat(im.key, ':', im.value) input,
	coalesce(group_concat(concat(imo.key, ':', imo.value) order by imo.key, imo.value asc separator '  |  '), "DELETE") output
from Import_Mappings im
	left join Import_Mappings_Outputs imo on im.id = imo.mappingId
where
	mpId = {mpId}
group by im.id
order by input, output, count(imo.key)