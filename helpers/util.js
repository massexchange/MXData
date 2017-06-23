const
    { stripIndent, TemplateTag, trimResultTransformer } = require("common-tags");

const util = {};

const isOnlyWhitespace = str =>
    str.replace(/\s/g, "").length == 0;

const stripOuterEmptyLines = {
    onEndResult(endResult) {
        let [ head, ...rest ] = endResult.split("\n");
        const tail = rest[rest.length - 1];
        rest = rest.slice(0, rest.length - 1);

        if(!isOnlyWhitespace(head))
            rest.unshift(head);
        if(!isOnlyWhitespace(tail))
            rest.push(tail);

        return rest.join("\n");
    }
};

const leadingWhitespace = /^[ \t]*(?=\S)/gm;

const undent = {
    onEndResult(endResult) {
        const resultLines = endResult.split("\n");

        const ignoreFirst = resultLines[0][0] != " ";

        const resultPart = ignoreFirst
            ? resultLines.slice(1).join("\n")
            : endResult;

        const match = resultPart.match(leadingWhitespace);

        // return early if there's nothing to strip
        if (match === null)
            return endResult;

        const indent = Math.min(...match.map(el => el.length));
        const regexp = new RegExp(`^[ \\t]{${indent}}`, "gm");

        return indent > 0
            ? endResult.replace(regexp, "")
            : endResult;
    }
};

const leadingSpaces = /^\s+/;

const multilineSubstitutions = {
    onSubstitution(resultSoFar, sub) {
        const lines = resultSoFar.split("\n");
        const lastLine = lines[lines.length - 1];

        const foundLeadingSpaces = lastLine.match(leadingSpaces);
        if(!foundLeadingSpaces)
            return sub;

        const indent = foundLeadingSpaces[0];
        const subLines = sub.toString().split("\n");

        return [
            subLines[0],
            ...subLines.slice(1).map(line =>
                indent + line)
        ].join("\n");
    }
};

const stamper = (...transformers) => {
    const {
        subprocessors,
        endprocessors
    } = transformers.reduce((agg, { onSubstitution, onEndResult }) => {
        if(onSubstitution)
            agg.subprocessors.push(onSubstitution);
        if(onEndResult)
            agg.endprocessors.push(onEndResult);

        return agg;
    }, {
        subprocessors: [],
        endprocessors: []
    });

    return (strings, ...subs) => {
        const result = subs
            .map((sub, i) => [strings[i + 1], sub])
            .reduce(
                (soFar, [nextString, sub]) =>
                    soFar +
                    subprocessors.reduce((sub, processor) =>
                        processor(soFar, sub), sub) +
                    nextString,
                strings[0]);

        return endprocessors.reduce((end, processor) =>
            processor(end), result);
    };
};

const sql = util.sql = stamper(
    stripOuterEmptyLines,
    multilineSubstitutions,
    undent
);

util.entriesToMap = (agg, [key, value]) => {
    agg[key] = value;
    return agg;
};

util.alias = tableName =>
    tableName
        .split("_")
        .map(part => part[0].toLowerCase())
        .join("");

util.table = name => sql`
    ${name} ${util.alias(name)}`;

util.deletionTable = name =>
    `${name}_To_Delete`;

util.deletionTables = entities => {
    const tables = entities
        .map(table => [table.toLowerCase(), {
            name: util.deletionTable(table)
        }]).reduce(util.entriesToMap, {});

    Object.values(tables)
        .forEach(table =>
            table.deleteWith = util.deleteWhereFieldsInTable(table.name));

    return tables;
};

util.aliases = entities => entities
    .map(entity =>
        [util.alias(entity), entity])
    .reduce(util.entriesToMap, {});

util.fieldInTable = (field, table) => sql`
    ${field} in (select * from ${table})`;

util.fieldRef = (table, name) => sql`
    ${util.alias(table)}.${name}`;

util.idRef = table =>
    util.fieldRef(table, "id");

util.selectIdsWhereFieldInTable = memberTable => (table, field) => sql`
    select id from ${table}
    where ${util.fieldInTable(field, memberTable)}
`;

util.selectWhereFieldInTable = memberTable => (table, field, fields = ["id"]) => sql`
    select ${fields.join(", ")} from ${table}
    where ${util.fieldInTable(field, memberTable)}
`;

util.deleteWhere = (targetTable, condition, memberTables = []) => {
    if(typeof memberTables != "object")
        memberTables = [memberTables];

    const fromTables = memberTables.length > 0
        ? sql`
        from
            ${[targetTable, ...memberTables]
                .map(util.table).join(",\n")}
        `
        : `from ${targetTable}`;

    return sql`
        delete ${util.alias(targetTable)}
        ${fromTables}
        where ${condition};
    `;
};

util.deleteWhereFieldsInTable = memberTable => (targetTable, fields = ["id"], memberId = "id") => {
    //if only one field
    if(typeof fields != "object")
        fields = [fields];

    const condition = fields.map(field => sql`
        ${util.fieldRef(targetTable, field)} = ${util.fieldRef(memberTable, memberId)}
    `).join(" or\n");

    return util.deleteWhere(targetTable, condition, memberTable);
};

module.exports = util;
