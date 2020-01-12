const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const fse = require("fs-extra");
const UrlFile = require("./url-file");
const Url = require("./url");


const Page = {};

Page.saveResourceToFile = function() {
	return function(current) {
		console.log("saveResourceToFile");
		return axios
			.get(current.oldUrl.uniqueUrl, { responseType: "stream" })
			.then(response => new Promise((resolve, reject) => {
				const { location } = current.file;
				
				fse.ensureFileSync(location);
				
				response.data
		          .pipe(fs.createWriteStream(location))
		          .on('finish', () => resolve())
		          .on('error', error => reject(error));
			}))
			.then(() => ({ 
				success: true, 
				message: "Successfully save resource",
				urls: [] 
			}))
		}
}


Page.savePageToFile = function(scraper, modifier) {
	return function(current) {
		console.log("savePageToFile");
		const urls = [];
		return scraper(current)
			.then(modifier(current, urls))
			.then(Page.saveCheerioToFile(current))
			.then(() => ({ 
				success: true, 
				message: "Successfully save page",
				urls
			}))
	}
}

Page.saveCheerioToFile = function(url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	return function($) {
		return fse.outputFileSync(url.file.location, $.html());
	}
}


Page.getCheerioWithAxios = function(url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	console.log("getCheerioWithAxios");
	return axios
		.get(url.oldUrl.uniqueUrl)
		.then(response => {
			// console.log(response);
			return cheerio.load(response.data);
		});
}


Page.getCheerioWithPuppeteer = function(url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	console.log("getCheerioWithPuppeteer");
	return puppeteer
		.launch()
		.then(browser => browser.newPage())
		-then(page => Page.goto(url.oldUrl.uniqueUrl))
		// TODO - await the content
		.then(page => cheerio.load(Page.html()));
}


module.exports = Page;