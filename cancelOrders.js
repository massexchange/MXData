module.exports = mpId => `
update Orders
set status = "Cancelled"
where mpId = ${mpId}`;
