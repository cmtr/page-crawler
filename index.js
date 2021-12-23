const minimist = require('minimist')
const File = require("./src/file");
const Url = require("./src/url");
const UrlFile = require("./src/url-file");
const Crawler = require("./src/crawler");


console.log("Start static page generator");

// const args = minimist(process.argv/*.slice(2)*/);

const rootUrl = "localhost:3000";

Crawler("http://" + rootUrl, "./copy", { 
	transform: true,
	defaultHost: 'localhost:3000'
});

module.exports = {
	Crawler, File, UrlFile, Url
};