var groupEffectiveShard = require("./groupEffectiveShard");

module.exports = mpId => `
-- these should all be 1, otherwise you've got a problem

select
    ga.attributes,
    count(ga.groupId) groups
from (${groupEffectiveShard(mpId)}) ga
group by attributes;
`;
