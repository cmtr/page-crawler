

const URL_SEPERATOR = "/";
const HASH_SEPERATOR = "#";
const QUERY_SEPERATOR = "?";
const FILE_SEPERATOR = ".";
const EXTERNAL_KEYS = [ "http", "https" ];


const url = {
	url: "",
	path: [],
	name: "",
	extension: "",
	isFile: false,
	isExternal: false,
	isRelative: false,
	isHtml: false,
	isJavaScript: false,
	isCss: false
}

function combined(orgUrl) {
	const split = getUrl(orgUrl);
	const url = split[0];
	const urlArr = splitUrl(url);
	
	const external = isExternal(url);
	const rootUrl = external ? urlArr[1] : "";
	const start = external ? 2 : 0;
	const path = urlArr.splice(start, urlArr.length - 1);

	const fileName = getFileName(url);
	const fileExtension = getFileExtension(url);

	return {
		url,
		extension: split[1],
		path,
		fileName,
		fileExtension,
		isFile: fileExtension.length > 0,
		isPage: fileExtension === "html" || fileExtension.length === 0,
		isHtml: fileExtension === "html",
		isJavaScript: fileExtension === "js",
		isCss: fileExtension === "css",
		isExternal: external,
		isRelative: isRelative(url),
		rootUrl
	}
}

function getUrl(url) {
	const hashIndex = url.indexOf(HASH_SEPERATOR);
	const queryIndex = url.indexOf(QUERY_SEPERATOR);
	const arr = [ hashIndex, queryIndex ].filter(idx => idx >= 0);

	if (arr.length === 0) return [ url.toLowerCase() , "" ];

	const split = Math.min(...arr);

	const extension =  url.substring(split);
	const newUrl = url.substring(0,split).toLowerCase();

	return [ newUrl, extension ];

}

function splitUrl(url) {
	const arr = url
		.toLowerCase()
		.split(URL_SEPERATOR)
		.filter(str => str !== null && str.length > 0);
	return arr;
}

function isRelative(url) {
	if (url.length < 1) return false;
	if (url.substring(0,1) === URL_SEPERATOR) return false;
	if (isExternal(url)) return false;
	return true;
}

function isFile(url) {
	return getFileExtension(url).length > 0;
}

function getFileName(url) {
	const index = url.lastIndexOf(URL_SEPERATOR);
	const last = index === -1 ? url : url.substring(index + 1);
	const seperatorIndex = last.lastIndexOf(FILE_SEPERATOR);
	return seperatorIndex === -1 ? last : last.substring(0, seperatorIndex);
}

function getFileExtension(url) {
	const index = url.lastIndexOf(URL_SEPERATOR);
	const last = index === -1 ? url : url.substring(index);
	const seperatorIndex = last.lastIndexOf(FILE_SEPERATOR);
	return seperatorIndex === -1 ? "" : last.substring(seperatorIndex + 1).toLowerCase();
}

function isExternal(url) {
	const firstSeperator = url.indexOf(URL_SEPERATOR);
	if (firstSeperator <= 0) return false;
	const first = url.substring(0, firstSeperator).toLowerCase();
	return EXTERNAL_KEYS.some(key => key + ":" === first);
}

function isHtml(url) {
	return getFileExtension(url) === "html";
}

function isJavaScript(url) {
	return getFileExtension(url) === "js";
}

function isCss(url) {
	return getFileExtension(url) === "css";
}

function isPage(url) {
	const fileExtension = getFileExtension(url);
	return fileExtension === "html" || fileExtension.length === 0;
}

module.exports = {
	combined,
	getUrl, 
	splitUrl, 
	isExternal,
	isRelative,
	isPage,
	isFile,
	getFileName,
	getFileExtension,
	isHtml,
	isCss,
	isJavaScript
}