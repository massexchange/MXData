#! /usr/bin/env node
var nconf = require("nconf"),
    render = require("./render");

nconf.argv();

var params = nconf.get("_");
console.log(render(params[0], params.slice(1)));
