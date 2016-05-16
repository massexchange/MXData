module.exports = (scriptName, params) => {
    if(!scriptName)
        throw new Error("Script name must be specified");

    return require(`./${scriptName}`).apply(null, params);
};
