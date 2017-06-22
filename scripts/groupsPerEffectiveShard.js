const
    { sql } = require("../helpers/util"),
    groupEffectiveShard = require("../helpers/groupEffectiveShard");

module.exports = mpId => sql`
    -- these should all be 1, otherwise you've got a problem

    select
        ga.attributes,
        count(ga.groupId) groups
    from (${groupEffectiveShard(mpId)}) ga
    group by attributes;
`;
