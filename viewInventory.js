var formatDate = require("./formatDate"),
    formatAttrs = require("./formatAttrs");

module.exports = mpId => `
select
    i.id invId,
    ${formatDate("date")} day,
    ${formatAttrs()} attributes
from
    Inventory i,
    Instrument_Attributes ia,
    Attributes a,
    Attribute_Types at
where
    i.mpId = ${mpId} and
    i.instId = ia.instId and
    ia.attrId = a.id and
    a.typeId = at.id
group by invId
order by date asc;
`;
