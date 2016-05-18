var formatDate = require("./formatDate");

module.exports = (table, pred = "", dateField = "date") => `
select
	${formatDate(`a.${dateField}`)} as start,
	min(${formatDate(`c.${dateField}`)}) as end
from ${table} as a
	left join ${table} as b
		on a.${dateField} = addDate(b.${dateField}, 1)
	left join ${table} as c
		on a.${dateField} <= c.${dateField}
	left join ${table} as d
		on c.${dateField} = addDate(d.${dateField}, -1)
where
	${pred ? `${pred("a")} and` : ""}
	b.${dateField} is null and
	c.${dateField} is not null and
	d.${dateField} is null
group by a.${dateField};
`;
