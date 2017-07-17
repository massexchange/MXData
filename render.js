const
    { sql } = require("./helpers/util");

module.exports = (scriptName, params) => {
    if(!scriptName)
        throw new Error("Script name must be specified");

    const name = scriptName.split("/")[1];

    const script = require(`./scripts/${name}`);

    const result = sql`
        START TRANSACTION;

        ${script(...params)}

        COMMIT;
    `;

    return result;
};
