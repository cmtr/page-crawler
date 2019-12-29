const promisify = require('util').promisify;
const fs = require('fs');
const fse = require('fs-extra');
const readFile = promisify(fs.readFileSync);
const writeFile = promisify(fs.writeFileSync);
const ensureFile = fse.outputFileSync;

const fileName = "test_file.txt";
const path = "./testFolder/";

console.log(__dirname);

const print_string = "If you only want the current directory name, where the script is running in, e.g. workingdirectory use:";

fse.outputFile(path + fileName, print_string)
	.then(() => console.log("file written"));