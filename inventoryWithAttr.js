module.exports = attrId => `
select * from Inventory i
where instId in (
    select instId from Instrument_Attributes
    where attrId = ${attrId}
)`;
