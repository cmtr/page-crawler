const promisify = require("util").promisify;
const fs = require("fs");
const cheerio = require("cheerio");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function readFile(filePath, options){
  return readFile(filePath, options)
	.then(function(contents){
		return cheerio.load(contents);
  });
};

function writeFile(filePath, $, options) {
	return Promise
		.resolve()
		.then(function(){
			const contents = $.html();
			return writeFile(filePath, contents, options);
		});
};

module.exports = { readFile, writeFile };