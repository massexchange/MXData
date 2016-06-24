#! /usr/bin/env node
var nconf = require("nconf"),
    render = require("./render");

nconf.argv();

var params = nconf.get("_");

if(params.length == 0) {
    console.log(`Specifiy a script to be generated:
    mx-data <script> [params...]`);
    process.exit(0);
}

console.log(render(params[0], params.slice(1)));
