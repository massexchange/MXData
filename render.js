module.exports = (scriptName, params) => {
    if(!scriptName)
        throw new Error("Script name must be specified");

    return require(`./scripts/${scriptName.split("/")[1]}`).apply(null, params);
};
