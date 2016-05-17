module.exports = (nameField = "name", valueField = "value", showId = true) =>
`group_concat(
    ${nameField}, ':',
    ${valueField}
    ${showId ? ", ' (', attrId, ')'" : ""}
    order by ${nameField} asc
    separator '  |  '
)`;
