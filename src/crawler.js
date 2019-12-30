const axios = require('axios');
const puppeteer = require('puppeteer');
const fse = require('fs-extra');
const UrlFile = require("./url-file");

Set.prototype.addAll = function(iterable) {
	for (let item of iterable) {
		this.add(item);
	}
}

Array.prototype.pushArray = function(arr) {
	this.push.apply(this, arr);
}

async function crawler(url, rootDirectory=__dirname, options={
	external: 0,
	transform: false,
	https: false,
	loadJavaScript: false,
	fsOptions: {}
}) {
	const queue = [];
	const queueUrls = new Set();
	
	const newUrls = new Set();

	const completedUrls = new Set();
	const completed = new Set();
	// const completedMap = new Map();
	
	const failures = new Set();
	const failureUrls = new Set();
	// const failuerMap = new Map();
	
	const urlSets = [ completedUrls, newUrls, queueUrls, failureUrls ];
	const isNewUrl = url => urlSets.every(set => !set.has(url.oldUrl.uniqueUrl));

	const getUrl = UrlFile.getFactory({

	})

	queue.push(getUrl(url));

	const modify = options.transform ? transformHyperlinks : collectHyperlinks;
	const rawScraper = options.loadJavaScript ? cheerioScraper : cheerioScraper; // TODO change to puppeteer of jS enabled
	const scraper = rawScraper.bind({}, rootDirectory, modify.bind({}, getUrl), options.fsOptions);

	while (queue.length > 0) {
		const current = queue.shift();
		await scraper(current)
			.then(success => {
				const { urls } = success;
				const newUniqueUrls = urls.map(url => url.newUrl.uniqueUrl);
				newUrls.addAll(newUniqueUrls);

				const newCollectedUrls = urls.filter(isNewUrl);
				queue.pushArray(newCollectedUrls);
				const newCollectedUniqueUrls = newCollectedUrls.map(url => url.oldUrl.uniqueUrl);
				queueUrls.addAll(newCollectedUniqueUrls);

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
		// success - add to completed
		// failure - add to back of queue - increment attempt
	}

}





function collectHyperlinks(getUrl, $) {
	// find all a-tags
	// find all script-tags
	// find all link-tags
	// find all img-tags
}

function transformHyperlinks(getUrl, $) {
	// modify all isPage & !isHtml => isHtml

	// find all a-tags
	// find all script-tags
	// find all link-tags
	// find all img-tags
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

function saveUrlToFile(rootDirectory, modify, options={
	loadJavaScript: false,
}) {
	
	const cheerioSupplier = options.loadJavaScript ? getCheerioWithPuppeteer : getCheerioWithAxios;
	const pageToFile = savePageToFile(cheerioSupplier, rootDirectory, modify);
	const resourceToFile = saveResourceToFile(rootDirectory);
	return function(url) {
		return url.isPage() ? pageToFile(url) : resourceToFile(url);
	}
}

function saveResourceToFile(rootDirectory) {
	return axios
		.get(url.oldUrl.uniqueUrl, { responseType: "stream" })
		.then(response => new Promise((resolve, reject) => {
			const { location } = url.file;
			
			fse.ensureFileSync(location);
			
			response.data
	          .pipe(fs.createWriteStream(location))
	          .on('finish', () => resolve())
	          .on('error', error => reject(error));
		}));
	
}

function savePageToFile(cheerioSupplier, rootDirectory, modify=e => e) {
	return function(url) {
		if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
		return cheerioSupplier(url.uniqueUrl)
			.then(modify)
			.then(saveCheerioToFile(rootDirectory, url));
	}
}


function saveCheerioToFile(rootDirectory, url) {
	if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
	return function($) {
		return fse.outputFileSync(url.file.location, $.html());
	}
}


module.exports = crawler;