const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const fse = require("fs-extra");
const UrlFile = require("./url-file");
const Url = require("./url");

function crawlerFactory(url, rootDirectory="", options={}) {
	// Configurations & Defaults
	const depth = options.depth || 0;
	const transform = options.transform || false;
	const loadJavaScript = options.loadJavaScript || false;
	const pageFormats = options.pageFormats || ["html", "php", "asp"];
	const pageFileExtension = options.pageFileExtension || "html";
	const indexPageFileName = options.indexPageFileName || "index";
	const targetUrl = options.targetUrl || "http://localhost:8080";
	const defaultProtocol = options.defaultProtocol || "http";
	const defaultHost = options.defaultHost || "localhost:8080";

	const urlFactory = UrlFile.getFactory({
		rootDirectory, 
		pageFormats, 
		pageFileExtension,
		indexPageFileName,
		pageFileExtension,
		oldProtocal: Url.getProtocol(url, defaultProtocol),
		oldHost: Url.getHost(url, defaultHost),
		newProtocal: Url.getProtocol(targetUrl, defaultProtocol),
		newHost: Url.getHost(targetUrl, defaultHost),
	}); 
	
	const hyperlinkConsumer = transform ? transformHyperlinks : collectHyperlinks;
	const modifier = hyperlinkConsumer(urlFactory);
	const scraper = loadJavaScript ? getCheerioWithPuppeteer : getCheerioWithAxios; ;

	return getCrawler(
			savePageToFile(scraper, modifier, savePageToFile), 
			saveResourceToFile(), 
			isResourcePredicate(pageFormats),
			logFactory(url, rootDirectory, Date.now())
		)(urlFactory(url));
}

function getCrawler(pageToFile, resourceToFile, isResourcePredicate, toLog) {
	console.log("getCrawler called")
	return async function(url) {
		
		const queue = [];
		const queueUrls = new Set(); // String
		const completedUrls = new Set(); // String 
		const completed = new Set();
		const failures = new Set();
		const failureUrls = new Set(); // String

		queue.push(url);
		queueUrls.add(url.oldUrl.uniqueUrl);

		const isUrlUnique = uniqueUrlFactory(completedUrls, queueUrls, failureUrls);

		while (queue.length > 0) {
			const current = queue.shift();
			const persistanceFunction = current.isPage ? pageToFile : resourceToFile;

			await persistanceFunction(current)
				.then(success => {
					success.urls
						.filter(url => isUrlUnique(url) && ((url.oldUrl.isExternal && !url.isPage) || (!url.oldUrl.isExternal && url.isPage)))
						.forEach(url => {
							queueUrls.add(url.oldUrl.uniqueUrl);
							queue.push(url);	
						});
					
					current.success = success.success;
					current.completed = Date.now();
					current.message = success.message;

					completed.add(current);
					completedUrls.add(current.oldUrl.uniqueUrl);
					queueUrls.delete(current.oldUrl.uniqueUrl);

					console.log(`Successfully saved ${current.oldUrl.uniqueUrl}
						\n\tTo file: ${current.file.location}
						\n\tNew url: ${current.newUrl.uniqueUrl}
						\nCompleted: ${completed.size}\tFailures: ${failures.size}\tRemaining: ${queue.length}`
					);
				})
				.catch(failure => {
					console.log(`Failure to scrape:\n\t Url: ${current.oldUrl.uniqueUrl}\n\t Error message: ${failure.message}`);
					if (!("attempt" in current) || current.attempt < 5) {
						current.attempt = current.attempt + 1 || 0;	
						queue.push(current);			
						console.log("")
					} else {
						failures.add(current)
						failureUrls.add(current.oldUrl.uniqueUrl);
						queueUrls.delete(current.oldUrl.uniqueUrl);
						current.success = failure.success;
						current.attempted = Date.now();
						current.message = failure.message;
						// TODO - add message
						console.log("Failure ")
					}
				});
		}

		toLog(completed, failures);

	}

}

function logFactory(url, rootDirectory="", startAt=Date.now()) {
	return function toLog(completedSet, failureSet) {
		const completed = [];
		completedSet.forEach(url => completed.push(url));
		const failure = [];
		failureSet.forEach(url => failure.push(url));
		
		const log = {
			failure,
			completed,
			url,
			startAt,
			finishAt: Date.now()
		};

		fse.writeJsonSync('./cmtr/log.json', log);

	}
}

function saveResourceToFile() {
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

function savePageToFile(scraper, modifier) {
	return function(current) {
		console.log("savePageToFile");
		const urls = [];
		return scraper(current)
			.then(modifier(current, urls))
			.then(saveCheerioToFile(current))
			.then(() => ({ 
				success: true, 
				message: "Successfully save page",
				urls
			}))
	}
}

function saveCheerioToFile(url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	return function($) {
		return fse.outputFileSync(url.file.location, $.html());
	}
}


function getCheerioWithAxios(url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	console.log("getCheerioWithAxios");
	return axios
		.get(url.oldUrl.uniqueUrl)
		.then(response => {
			// console.log(response);
			return cheerio.load(response.data);
		});
}


function getCheerioWithPuppeteer(url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	console.log("getCheerioWithPuppeteer");
	return puppeteer
		.launch()
		.then(browser => browser.newPage())
		-then(page => page.goto(url.oldUrl.uniqueUrl))
		// TODO - await the content
		.then(page => cheerio.load(page.html()));
}


function collectAttrFactory(urlFactory, $, collection) {
	return async function(tag, attrKey) {
		const tags = await $(tag);
		tags.each(idx => {
			const orgUrl = tags[idx].attribs[attrKey];
			if (urlCollectorPrecicate(orgUrl))
			collection.push(orgUrl);
		});
		return collection;
	}
}

const urlCollectorPrecicate = e => typeof e === "string" && e.length > 0 && !/^#/.test(e) && !/^mailto:/.test(e);

function collectHyperlinks(urlFactory) {
	return function(current, urls=[]) {
		return async function($) {
			console.log("From collect Hyperlinks");
			const collectedUrls = [];
			const getAttr = collectAttrFactory(urlFactory, $, collectedUrls); 
			getAttr("a", "href");
			getAttr("script", "src");
			getAttr("img", "src");
			getAttr("link", "src");
			Array.prototype.push.apply(urls, collectedUrls);
			return $;
		}
	}
}


function transformAttrFactory(urlFactory, $, collection) {
	return function(tag, attrKey) {
		const tags = $(tag);
		tags.each(idx => {
			const orgUrl = tags[idx].attribs[attrKey];
			if (urlCollectorPrecicate(orgUrl)) {
				const url = urlFactory(orgUrl);
				tags[idx].attribs[attrKey] = "/" + url.newUrl.route;
				collection.push(url);	
			}
		})
	}
}

function transformHyperlinks(urlFactory) {
	return function(current, urls=[]) {
		return function($) {
			console.log("From transformHyperlinks");
			const collectedUrls = [];
			const transfromAttr = transformAttrFactory(urlFactory, $, collectedUrls);
			transfromAttr("a", "href");
			transfromAttr("script", "src");
			transfromAttr("img", "src");
			transfromAttr("link", "src");
			Array.prototype.push.apply(urls, collectedUrls);
			return $;
		}
	}
}


function uniqueUrlFactory(...sets) {
	if (!sets.every(set => set instanceof Set)) throw new TypeError("All arguments must be of class Set.");
	return function(url) {
		return !sets.some(set => set.has(url.oldUrl.uniqueUrl));
	}
}


module.exports = crawlerFactory;