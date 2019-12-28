const axios = require("axios");
const cheerio = require("cheerio");
const { writeFile } = require("./fs-cheerio");
const { combined } = require("util");


function saveLoadPage(urlObj, modify=e => e, fsOptions) {
	return axios.get(getUrl(urlObj))
		.then(page => cheerio.load(page))
		.then(modify)
		.then(saveToFile(url, fsOptions));
}


function getUrl(url) {
	// TODO - SOme logic here
	return url.rootUrl + "/" + url.url;
}

function saveToFile(url, fsOptions) {
	const fileName = "todo"
	return function($) {
		return writeFile(fileName, $, fsOptions);
	}
}


module.exports = {
	saveToFile, saveLoadPage, getUrl
}