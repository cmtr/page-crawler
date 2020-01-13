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
		if (!(current instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
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
		if (!(current instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
		const urls = [];
		return scraper(current)
			.then(modifier(current, urls))
			.then(Page.saveCheerioToFile(current.file.location))
			.then(() => ({ 
				success: true, 
				message: "Successfully save page",
				urls
			}))
	}
}

Page.saveCheerioToFile = function(location) {
	return function($) {
		return fse.outputFileSync(location, $.html());
	}
}


Page.getCheerioWithAxios = function(url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	return axios
		.get(url.oldUrl.uniqueUrl)
		.then(response => cheerio.load(response.data));
}

Page.getCheerioWithPuppeteer = function(url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	return puppeteer
		.launch()
		.then(browser => browser.newPage())
		-then(page => Page.goto(url.oldUrl.uniqueUrl))
		// TODO - await the content
		.then(page => cheerio.load(Page.html()));
}


module.exports = Page;