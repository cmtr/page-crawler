const Url = require("./url");

const URL_SEPERATOR = "/";
const HASH_SEPERATOR = "#";
const QUERY_SEPERATOR = "?";
const FILE_SEPERATOR = ".";
const PROTOCOL_SEPERATOR = ":";

class File {

	constructor(rootDirectory="", filePath=[], fileExtension, fileName, location, rootLocation) {
		this.rootDirectory = rootDirectory;
		this.filePath = filePath
		this.fileExtension = fileExtension;
		this.fileName = fileName;
		this.location = location;
		this.rootLocation = rootLocation;
	}

}


File.getFullFilePath = function(rootDirectory="", filePath=[], fileName="", fileExtension="") {
	if (typeof rootDirectory !== "string" || typeof fileName !== "string" || typeof fileExtension !== "string") throw new TypeError("Root dieectory, file name and extension must be a string");
	if (!Array.isArray(filePath)) throw new TypeError("File path must be an Array");
	if (filePath.some(e => typeof e !== "string")) throw new TypeError("All file elements must be strings");

	return `.${rootDirectory.length > 0 ?  "/" + rootDirectory : ""}${filePath.length > 0 ? "/" + filePath.join("/") : ""}/${fileName}.${fileExtension}`;
}


File.getRootFilePath = function(filePath=[], fileName="", fileExtension="") {
	return File.getFullFilePath("", filePath, fileName, fileExtension);
}

File.getFilePathFromRoute = function(route="", defaultExtension="") {
	if (typeof route !== "string") throw new TypeError("Route must be a string");
	const path = route
		.trim()
		.split(URL_SEPERATOR)
	return path.splice(0, path.length - 1);
}


File.getFileExtensionFromRoute = function(route="", defaultExtension="") {
	if (!(typeof route === "string")) throw new TypeError("Route must be a string");
	const index = route.lastIndexOf(URL_SEPERATOR);
	const last = index === -1 ? route : route.substring(index);
	const seperatorIndex = last.lastIndexOf(FILE_SEPERATOR);
	return seperatorIndex === -1 ? defaultExtension : last.substring(seperatorIndex + 1).toLowerCase();
}


File.getFileNameFromRoute = function(route="", query="") {
	if (typeof route !== "string" || typeof query !== "string") throw new TypeError("Route and query must be a string");
	const index = route.lastIndexOf(URL_SEPERATOR);
	const last = index === -1 ? route : route.substring(index + 1);
	const seperatorIndex = last.lastIndexOf(FILE_SEPERATOR);
	const first = seperatorIndex === -1 ? last : last.substring(0, seperatorIndex);
	const second = query.length > 0 ? "$" + query : "";
	return first + second;
}


File.getHostRoute = function(host) {
	const route = host.split(FILE_SEPERATOR);
	route.reverse();
	return route.join(URL_SEPERATOR);
}


File.getUrlFileFactory = function(rootDirectory="", pageFileExtension="html", pageFormats=["html", "php"], defaultIndexPageFileName="index") {
	if (typeof rootDirectory !== "string") throw new TypeError("Root directory must be a string");
	return function(url) {
		if (typeof url === "string") url = new Url(url);
		if (!(url instanceof Url)) throw new Error("Url must be of Url type");

		const filePathString = url.isExternal 
			? File.getHostRoute(url.host) + "/" + url.route
			: url.route;
		const filePath = File.getFilePathFromRoute(filePathString);
		const fileExtension = File.getFileExtensionFromRoute(url.route, pageFileExtension);
		const route = url.isIndex ? defaultIndexPageFileName : url.route;
		const fileName = File.getFileNameFromRoute(route, url.query);
		const location = File.getFullFilePath(rootDirectory, filePath, fileName, fileExtension);
		const rootLocation = File.getRootFilePath(filePath, fileName, fileExtension);
		return new File(rootDirectory, filePath, fileExtension, fileName, location, rootLocation);
	}
}


module.exports = File;