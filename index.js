const minimist = require('minimist')
const File = require("./src/file");
const Url = require("./src/url");
const UrlFile = require("./src/url-file");
const Crawler = require("./src/crawler");


console.log("Start static page generator");

const args = minimist(process.argv/*.slice(2)*/);

const rootUrl = "localhost:3010";

Crawler("http://" + rootUrl, "./copy");

module.exports = {
	Crawler, File, UrlFile, Url
};