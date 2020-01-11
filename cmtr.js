const crawlerFactory = require('./src/crawler');


const rootUrl = "http://localhost:3010";
const directory = "cmtr/v1";
const options = {
	depth: 0,
	transform: false,
	loadJavaScript: false,
	pageFileExtension: "html",
	targetUrl: "http://localhost:4000",
}

crawlerFactory(rootUrl, directory, options);