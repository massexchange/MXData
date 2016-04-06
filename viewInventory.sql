select
    i.id invId,
    concat(month(date), "/", day(date), "/", year(date)) day,
    group_concat(name, ': ', value order by name asc separator '  |  ') attributes
from
    Inventory i,
    Instrument_Attributes ia,
    Attributes a,
    Attribute_Types at
where
    i.mpId = {mpId} and
    i.instId = ia.instId and
    ia.attrId = a.id and
    a.typeId = at.id
group by invId
order by date asc