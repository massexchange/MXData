module.exports = () =>
`group_concat(
    name, ':',
    value,
    ' (', attrId, ')'
    order by name asc
    separator '  |  '
)`;
