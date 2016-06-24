module.exports = typeId =>
    `select * from Attributes where typeId = ${typeId};`;
