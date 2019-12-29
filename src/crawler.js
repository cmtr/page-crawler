const { combined, getRootUrl, isHttps  } = require("./url");
const scraper = require("./cheerio-scraper"); 

async function crawler(url, rootDirectory, options={
	external: 0,
	transform: false,
	https: false,
	fsOptions: {}
}) {
	const queue = [];
	const completed = new Set();
	
	const getUrl = combined.bind({}, getRootUrl(url, isHttps(url, options.https)));

	queue.push(getUrl(url));

	// Modification factory
	const modify = options.transform ? transformHyperlinks : collectHyperlinks;

	while (queue.length > 0) {
		const current = queue.shift();
		const urls = [];
		await scraper(rootDirectory, current, modify.bind({}, getUrl, urls), options.fsOptions)
			.then(success => {
				// urls -  list of hyperlinks 
				// check if already completed, or else add to queue

				completed.add(current);
			})
			.catch(failure => {
				if (!("attempt" in current) || current.attempt < 5) {
					current.attempt = current.attempt + 1 || 1;	
					queue.push(current);			
				}
			});
		// success - add to completed
		// failure - add to back of queue - increment attempt
	}

}



function collectHyperlinks(getUrl, urls=[], $) {
	// find all a-tags
	// find all script-tags
	// find all link-tags
	// find all img-tags
}

function transformHyperlinks(getUrl, urls=[], $) {
	// modify all isPage & !isHtml => isHtml

	// find all a-tags
	// find all script-tags
	// find all link-tags
	// find all img-tags
}

module.exports = crawler;