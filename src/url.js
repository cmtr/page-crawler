const URL_SEPERATOR = "/";
const HASH_SEPERATOR = "#";
const QUERY_SEPERATOR = "?";
const FILE_SEPERATOR = ".";
const EXTERNAL_KEYS = [ "http", "https" ];


function combined(ROOT_URL, orgUrl) {
	const split = getUrl(orgUrl);
	const url = split[0];
	const extension = split[1];
	const urlArr = splitUrl(url);
	const external = isExternal(url);
	const fileExtension = getFileExtension(url);

	return {
		url,
		extension,
		path:  urlArr.splice(external ? 2 : 0, urlArr.length - 1),
		fileName: getFileName(url),
		fileExtension,
		isFile: fileExtension.length > 0,
		isPage: fileExtension === "html" || fileExtension.length === 0,
		isHtml: fileExtension === "html",
		isJavaScript: fileExtension === "js",
		isCss: fileExtension === "css",
		isExternal: external,
		isRelative: isRelative(url),
		rootUrl: external ? urlArr[1] : ROOT_URL
	};
}


function getUrl(url) {
	const hashIndex = url.indexOf(HASH_SEPERATOR);
	const queryIndex = url.indexOf(QUERY_SEPERATOR);
	const arr = [ hashIndex, queryIndex ].filter(idx => idx >= 0);

	if (arr.length === 0) return [ url.toLowerCase() , "" ];

	const split = Math.min(...arr);
	const extension =  url.substring(split);
	const newUrl = url.substring(0, split).toLowerCase();

	return [ newUrl, extension ];

}

function splitUrl(url) {
	return url
		.toLowerCase()
		.split(URL_SEPERATOR)
		.filter(str => str !== null && str.length > 0);
}

function getRootUrl(url) {
	return isExternal(url) ? splitUrl(getUrl(url)[0])[1] : "";
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

function isPage(url) {
	const fileExtension = getFileExtension(url);
	return fileExtension === "html" || fileExtension.length === 0;
}

function isFile(url) {
	return getFileExtension(url).length > 0;
}

function isExternal(url) {
	const firstSeperator = url.indexOf(URL_SEPERATOR);
	if (firstSeperator <= 0) return false;
	const first = url.substring(0, firstSeperator).toLowerCase();
	return EXTERNAL_KEYS.some(key => key + ":" === first);
}

function isRelative(url) {
	if (url.length < 1) return false;
	if (url.substring(0,1) === URL_SEPERATOR) return false;
	if (isExternal(url)) return false;
	return true;
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
	getRootUrl,
	isHtml,
	isCss,
	isJavaScript
};