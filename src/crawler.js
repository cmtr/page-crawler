const { combined, getRootUrl  } = require("./url");
const cs = require("./cheerio-scraper"); 

function crawler(url, rootDirectory, options={
	external: 0,
	static: false,
	fsOptions: {}
}) {
	const queue = [];
	const getUrl = combined.bind({}, getRootUrl(url));
	queue.push(getUrl(url));
	const modify = options.static 
		? modifyHyperlinks.bind({}, queue)
		: collectHyperlinks.bind({}, queue);
	const completed = new Set();
	while (queue.length > 0) {
		const current = queue.shift();
		// check if completed, continue;
		cs(rootDirectory, current, modify, options.fsOptions)
		// success - add to completed
		// failure - add to back of queue - increment attempt
	}

}



function collectHyperlinks(queue, $) {
	// find all a-tags
}

function modifyHyperlinks(queue, $) {
	// find all a-tags
	// find all script-tags
	// find all link-tags
	// find all img-tags
}

module.exports = crawler;