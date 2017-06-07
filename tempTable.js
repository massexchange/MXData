const { sql } = require("./util");

module.exports = name => {
    const create = source => sql`
        drop temporary table if exists ${name};
        create temporary table ${name} ${source};
    `;

    return {
        fromQuery: query  => create(sql`
            as (
                ${query}
            )`),
        fromData: (schema, data) => create(sql`
            (
                ${schema}
            );
            insert into ${name} VALUES ${data
                .map(val => `(${val})`)
                .join(", ")}
        `)
    };
};
