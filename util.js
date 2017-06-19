const
    { stripIndent, TemplateTag, trimResultTransformer } = require("common-tags"),
    outdent = require("outdent");

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
        let resultLines = endResult.split("\n");

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
        const lastLine = lines[lines.length-1];

        const foundLeadingSpaces = lastLine.match(leadingSpaces);
        if(!foundLeadingSpaces)
            return sub;

        const indent = foundLeadingSpaces[0];
        let subLines = sub.split("\n");

        return [
            subLines[0],
            ...subLines.slice(1).map(line =>
                indent + line)
        ].join("\n");
    }
};

const stamper = (...transformers) => {
    const {
        sub: subprocessors,
        end: endprocessors
    } = transformers.reduce((agg, { onSubstitution, onEndResult }) => {
        if(onSubstitution)
            agg.sub.push(onSubstitution);
        if(onEndResult)
            agg.end.push(onEndResult);

        return agg;
    }, {
        sub: [],
        end: []
    });

    return (strings, ...subs) => {
        const lastIndex = strings.length - 1;
        const tail = strings[lastIndex];

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

util.deleteWhere = (table, condition) => sql`
    delete from ${table}
    where ${condition}
`;

util.fieldInTable = (field, table) => sql`
    ${field} in (select * from ${table})`;

util.selectIdsWhereFieldInTable = memberTable => (table, field) => sql`
    select id from ${table}
    where ${util.fieldInTable(field, memberTable)}
`;

util.deleteWhereFieldInTable = (table, field, memberTable) =>
    util.deleteWhere(table,
        util.fieldInTable(field, memberTable));

util.alias = tableName =>
    tableName
        .split("_")
        .map(part => part[0].toLowerCase())
        .join("");

util.table = name => sql`
    ${name} ${util.alias(name)}`;

util.fieldRef = (table, name) => sql`
    ${util.alias(table)}.${name}`;

util.deleteWhereFieldsInTable = memberTable => (targetTable, ...fields) => sql`
    delete ${util.alias(targetTable)}
    from
        ${util.table(targetTable)},
        ${util.table(memberTable)}
    where ${
        fields.map(field => sql`
            ${util.fieldRef(targetTable, field)} = ${util.fieldRef(memberTable, "id")}
        `).join(" or\n")
    };
`;

module.exports = util;
