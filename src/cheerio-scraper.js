const axios = require("axios");
const cheerio = require("cheerio");
const { writeFile } = require("./fs-cheerio");
const { combined } = require("./url");


function saveLoadPage(rootDirectory, urlObj, modify=e => e, fsOptions) {
	return axios.get(getUrl(urlObj))
		.then(page => cheerio.load(page))
		.then(modify)
		.then(saveToFile(rootDirectory, url, fsOptions));
}


function getUrl(url) {
	// TODO - SOme logic here
	return "http://" + url.rootUrl + "/" + url.url;
}

function saveToFile(rootDirectory, url, fsOptions, urls) {
	const fileName = "todo"
	return function($) {
		return writeFile(fileName, $, fsOptions)
			.then(success =>);
	}
}


module.exports = saveToFile;