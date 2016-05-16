module.exports = dateField =>
    `concat(
        month(${dateField}), "/",
        day(${dateField}), "/",
        year(${dateField})
    )`;
