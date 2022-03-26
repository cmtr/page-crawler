const minimist = require('minimist')
const File = require("./src/file");
const Url = require("./src/url");
const UrlFile = require("./src/url-file");
const Crawler = require("./src/crawler");


console.log("Start static page generator");
// const args = minimist(process.argv/*.slice(2)*/);


const rootUrl = "localhost:8080";


Crawler("http://" + rootUrl, "./output", { 
	transform: true,
	defaultHost: 'localhost:8080'
});


module.exports = {
	Crawler, File, UrlFile, Url
};