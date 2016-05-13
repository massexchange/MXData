module.exports = (scriptName, params) => {
    var template = require(`./${scriptName}`);
    return template.apply(null, params);
};
