var formatDate = require("./formatDate");

module.exports = mpId => `
select
    min(${formatDate("date")}) start,
    max(${formatDate("date")}) end
from Inventory
where mpId = ${mpId};
`;
