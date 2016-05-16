module.exports = attrId => `
select instId
from Instrument_Attributes
where attrId = ${attrId};
`;
