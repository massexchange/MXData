module.exports = (name, query) => `
drop temporary table if exists ${name};
create temporary table ${name} as (${query});
`;
