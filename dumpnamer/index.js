const args = require("minimist")(process.argv.slice(2));
const fs = require("fs");

const fileExists = (directory) => {
    return new Promise((resolve, reject) => {
        fs.stat(directory, (err, stats) => {
            if (err) {
                resolve();
            } else {
                resolve(stats);
            }
        });
    });
};

const readFilePromise = (directory) => {
    return new Promise((resolve, reject) => {
        fs.readFile(directory, "utf-8", (err, data) => {
            if (err) {
                console.log(err);
                resolve();
            } else {
                resolve(data);
            };
        });
    });
};

const writeFilePromise = (directory, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(directory, content, (err, data) => {
            if (err) {
                console.log(err);
                resolve();
            } else {
                resolve(data);
            };
        });
    });
};

const main = () => {
    if (!args.src || !args.targetdb || !args.dest){
        console.log("error");
        process.exitCode = 1;
        return;
    }
    let doesSrcExistP = fileExists(args.src);
    let doesDestExistP = fileExists(args.dest);
    let files;
    Promise.all([doesSrcExistP, doesDestExistP])
    .then((output) =>{
        if (output[0] && !output[1]){
            files = fs.readdirSync(args.src);
            let readPs = [];
            files.forEach((file) => {
                readPs.push(readFilePromise(`${args.src}/${file}`));
            });
            return Promise.all(readPs);
        } else {
            console.log("Either the source doesn't exist, or the destination already exists.")
            console.log("Exiting")
            process.exitCode = 1;
            return;
        }
    }).then((fileContentArray) => {
        if (!fileContentArray) {
            process.exitCode = 1;
            return;
        }
        let writePs = [];
        fs.mkdirSync(args.dest);
        let itr = 0;
        fileContentArray.forEach((fileContent) => {
            let splitContent = fileContent.split("\n");
            splitContent[0] = splitContent[0].replace("MassExchange", args.targetdb);
            splitContent[1] = splitContent[1].replace("MassExchange", args.targetdb);
            writePs.push(writeFilePromise(`${args.dest}/${args.targetdb}-${files[itr]}`, splitContent.join("\n")));
            itr = itr + 1;
        });
        return Promise.all(writePs);
    }).then(()=>console.log("Jerb Done"));
}

main();
