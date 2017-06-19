const { sql } = require("./util");

module.exports = name => {
    const create = sql`
        drop temporary table if exists ${name};
        create temporary table ${name}`;

    return {
        fromQuery: query => sql`
            ${create} as (
                ${query}
            );`,
        fromData: (schema, data) => sql`
            ${create} (
                ${schema}
            );
            insert into ${name} values ${data
                .map(val => `(${val})`)
                .join(", ")};`
    };
};
