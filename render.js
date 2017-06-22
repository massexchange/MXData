module.exports = (scriptName, params) => {
    if(!scriptName)
        throw new Error("Script name must be specified");

    return require(`./scripts/${scriptName}`).apply(null, params);
};
