const axios = require('axios');
const puppeteer = require('puppeteer');
const fse = require('fs-extra');
const UrlFile = require("./url-file");

function crawlerFactory(url, rootDirectory=__dirname, options={}) {
	// Configurations & Defaults
	const depth = options.depth || 0;
	const transform = options.transform || false;
	const https = options.https || false;
	const loadJavaScript = options.loadJavaScript || false;
	const pageFormats = options.pageFormats || ["html", "php", "asp"];
	const defaultFileExtension = options.rootFileExtension || "html";
	const defaultPageFileExtension = options.pageFileExtension || "html";

	const urlFactory = UrlFile.getFactory({
		rootDirectory. pageFormats, https, defaultFileExtension,
	}); 


		/*
		const rootDirectory = options.rootDirectory || "";
		const pageFormats = options.pageFormats || ["html", "php", "asp"];
		const defaultIndexPageFileName = options.defaultIndexPageFileName || "index";
		const pageFileExtension = options.pageFileExtension || "html";
		const oldProtocal = options.oldProtocal || "http";
		const oldHost = options.oldHost || "localhost";
		const newProtocal = options.newProtocal || "http";
		const newHost = options.newHost || "localhost";
		*/
	
	const hyperlinkConsumer = transform ? transformHyperlinks : collectHyperlinks;
	const modifier = hyperlinkConsumer(urlFactory);
	
	const scraper = loadJavaScript ? getCheerioWithPuppeteer : getCheerioWithAxios; ;

	const pageToFile = savePageToFile(scarper, modifier, savePageToFile);
	const resourceToFile = saveResourceToFile()
	
	return getCrawler(pageToFile, resourceToFile, isResourcePredicate(pageFormats), urlFactory);
}


function isResourcePredicate(pageFormats=[]) {
	return function(url) {
		return pageFormats.some(extension => extension === url.file.fileExtension);
	}
}


function uniqueUrlFactory(...sets) {
	if (!sets.every(set => set instanceof Set)) throw new TypeError("All arguments must be of class Set.");
	return function(url) {
		return !sets.some(set => !set,has(url.oldUrl.uniqueUrl));
	}
}

function getCrawler(pageToFile, resourceToFile, isResourcePredicate, urlFactory) {
	return async function(rootUrl) {
		

		const queue = [];
		const queueUrls = new Set();
		
		const newUrls = new Set();

		const completedUrls = new Set();
		const completed = new Set();
		// const completedMap = new Map();
		
		const failures = new Set();
		const failureUrls = new Set();
		// const failuerMap = new Map();
		
		const uniqueUrlPredicate = ;

		const url = urlFactory(rootUrl);
		queue.push(url);
		queueUrls.add(url.uniqueUrl);

		while (queue.length > 0) {
			const current = queue.shift();

			const persistanceFunction = isResourcePredicate(current) ? resourceToFile : pageToFile;

			await persistanceFunction(current)
				.then(success => {
					const { urls } = success;
					const newUniqueUrls = urls.map(url => url.newUrl.uniqueUrl);
					newUniqueUrls.forEach(url => newUrls.add(url));
					const newCollectedUrls = urls.filter(uniqueUrlFactory(completedUrls, newUrls, queueUrls, failureUrls));
					
					Array.prototype.add(queue, newCollectedUrls);
					newCollectedUrls.forEach(url => queueUrls.add(url));

					completed.add(current);
					completedUrls.add(current.oldUrl.uniqueUrl);
					queueUrls.delete(current.oldUrl.uniqueUrl);

					console.log(`Successfully saved ${current.oldUrl.uniqueUrl}
						\n\tTo file: ${current.file.location}
						\n\tNew url: ${current.newUrls.uniqueUrl}
						\nCompleted: ${completed.size}\tFailures: ${failures.size}\tRemaining: ${queue.length}`
					);
				})
				.catch(failure => {
					if (!("attempt" in current) || current.attempt < 5) {
						current.attempt = current.attempt + 1 || 0;	
						queue.push(current);			
						console.log("")
					} else {
						failures.add(current)
						failureUrls.add(current.oldUrl.uniqueUrl);
						queueUrls.delete(current.oldUrl.uniqueUrl);
						console.log("")
					}
				});
		}
	}

}



function saveResourceToFile() {
	return function(current) {
			return axios
				.get(url.oldUrl.uniqueUrl, { responseType: "stream" })
				.then(response => new Promise((resolve, reject) => {
					const { location } = current.file;
					
					fse.ensureFileSync(location);
					
					response.data
			          .pipe(fs.createWriteStream(location))
			          .on('finish', () => resolve())
			          .on('error', error => reject(error));
				}));
				// TODO - Response		
			}
}

function savePageToFile(scraper, modifier) {
	return function(current) {
		return scraper(current)
			.then(modifier(current))
			.then(saveCheerioToFile(current));
			// TODO - Response
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
	return axios
		.get(url.uniqueUrl)
		.then(page => cheerio.load(page));
}


function getCheerioWithPuppeteer(url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	return puppeteer
		.launch()
		.then(browser => browser.newPage())
		-then(page => page.goto(url.uniqueUrl))
		.then(page => cheerio.load(page.html()));
}


function collectHyperlinks(urlFactory) {
	return function(current) {
		return function($) {
			// find all a-tags
			// find all script-tags
			// find all link-tags
			// find all img-tags	
		}
	}
}


function transformHyperlinks(urlFactory) {
	return function(current) {
		return function($) {
			// modify all isPage & !isHtml => isHtml

			// find all a-tags
			// find all script-tags
			// find all link-tags
			// find all img-tags			
		}
	}
}

/*
if (process.env.NODE_ENV === "test") {
	exports.isResourcePredicate = isResourcePredicate;
	exports.uniqueUrlFactory = uniqueUrlFactory;
	exports.transformHyperlinks = transformHyperlinks;
	exports.collectHyperlinks = collectHyperlinks;
	exports.getCheerioWithPuppeteer = getCheerioWithPuppeteer;
	exports.getCheerioWithAxios = getCheerioWithAxios;
	exports.savePageToFile = savePageToFile;
	exports.saveResourceToFile = saveResourceToFile;
} else {
	exports = crawlerFactory;	
}
*/

exports = crawlerFactory;	