const UrlFile = require("./url-file");
const Url = require("./url");
const { saveResourceToFile, savePageToFile, getCheerioWithAxios, getCheerioWithPuppeteer} = require("./page");
const { collectHyperlinks, transformHyperlinks } = require('./page-transform');
const { logFactory } = require('./log');

function crawlerFactory(url, rootDirectory="", options={}) {
	// Configurations & Defaults
	const depth = options.depth || 0;
	const transform = options.transform || false;
	const loadJavaScript = options.loadJavaScript || false;
	const pageFormats = options.pageFormats || ["html", "php", "asp"];
	const pageFileExtension = options.pageFileExtension || "html";
	const indexPageFileName = options.indexPageFileName || "index";
	const targetUrl = options.targetUrl || "http://localhost:3000";
	const defaultProtocol = options.defaultProtocol || "http";
	const defaultHost = options.defaultHost || "localhost:3000";

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
	const scraper = loadJavaScript ? getCheerioWithPuppeteer : getCheerioWithAxios;

	return getCrawler(
			savePageToFile(scraper, modifier), 
			saveResourceToFile(), 
			logFactory(url, rootDirectory, Date.now())
		)(urlFactory(url));
}

function getCrawler(pageToFile, resourceToFile,  toLog) {
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
					console.log(`Failed to saved ${current.oldUrl.uniqueUrl}
						\n\tError message: ${failure.message}
						\n\tTo file: ${current.file.location}
						\n\tNew url: ${current.newUrl.uniqueUrl}
						\nCompleted: ${completed.size}\tFailures: ${failures.size}\tRemaining: ${queue.length}`
					);
					}
				});
		}

		toLog(completed, failures);

	}

}




function uniqueUrlFactory(...sets) {
	if (!sets.every(set => set instanceof Set)) throw new TypeError("All arguments must be of class Set.");
	return function(url) {
		if (!(url instanceof UrlFile)) throw new Error("Url must be of class UrlFile.");
		return !sets.some(set => set.has(url.oldUrl.uniqueUrl));
	}
}


module.exports = crawlerFactory;