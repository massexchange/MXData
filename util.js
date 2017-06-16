const
    { stripIndent, TemplateTag, trimResultTransformer } = require("common-tags"),
    outdent = require("outdent");

const util = {};

const isOnlyWhitespace = str =>
    str.replace(/\s/g, "").length == 0;

const stripOuterEmptyLines = new TemplateTag({
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
});

const undent = new TemplateTag({
    onEndResult(endResult) {
        console.log(`String: "${endResult}"`);

        let resultLines = endResult.split("\n");

        const ignoreFirst = resultLines[0][0] != " ";
        console.log(`Ignoring first: ${ignoreFirst}`);

        // console.log(resultLines);

        const resultPart = ignoreFirst
            ? resultLines.slice(1).join("\n")
            : endResult;

        const match = resultPart.match(/^[ \t]*(?=\S)/gm);

        // return early if there's nothing to strip
        if (match === null)
          return endResult;

        // console.log(match);

        const indent = Math.min(...match.map(el => el.length));
        const regexp = new RegExp(`^[ \\t]{${indent}}`, "gm");

        console.log(`Stripping ${indent} spaces`);

        const result = indent > 0
            ? endResult.replace(regexp, "")
            : endResult;

        console.log(`Result: "${result}"\n`);

        return result;
    }
});

const multilineSubstitutions = new TemplateTag({
    onSubstitution(sub, resultSoFar) {
        console.log(`Substitution: "${sub}"`);

        const lines = resultSoFar.split("\n");
        const indent = [...lines[lines.length-1]]
            .filter(char => char == " ").join("");

        console.log(`Indenting substitution ${indent.length} spaces`);

        let subLines = sub.split("\n");
        // if(subLines[0] == "")
        //     subLines = subLines.slice(1);

        const result = [
            subLines[0],
            ...subLines.slice(1).map(line =>
                indent + line)
        ].join("\n");

        console.log(`Substitution result: "${result}"\n`);

        return result;
    }
});
// }, trimResultTransformer);

//TODO: resolve order
const sql = util.sql = multilineSubstitutions(undent(stripOuterEmptyLines));

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
