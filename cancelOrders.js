module.exports = mpId => `
update MassExchange.Orders
set status = "Cancelled"
where mpId = ${mpId}`;
