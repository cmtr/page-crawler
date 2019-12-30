const Url = require("./url");

const URL_SEPERATOR = "/";
const HASH_SEPERATOR = "#";
const QUERY_SEPERATOR = "?";
const FILE_SEPERATOR = ".";
const PROTOCOL_SEPERATOR = ":";

class File {

	constructor(filePath, fileExtension, fileName, url) {
		this.filePath = filePath
		this.fileExtension = fileExtension;
		this.fileName = fileName;
		this.location = File.getFullFilePath(this.filePath, this.fileName, this.fileExtension)
		this.url = url;
	}

	static getFullFilePath(filePath=[], fileName="", fileExtension="") {
		if (typeof fileName !== "string" || typeof fileExtension !== "string") throw new TypeError("File name and extension must be a string");
		if (!Array.isArray(filePath)) throw new TypeError("File path must be an Array");
		if (filePath.some(e => typeof e !== "string")) throw new TypeError("All file elements must be strings");

		return `./${filePath.join("/")}/${fileName}.${fileExtension}`;
	}

	static getFilePathFromRoute(route="", defaultExtension="") {
		if (typeof route !== "string") throw new TypeError("Route must be a string");
		const path = route.split(URL_SEPERATOR);
		return path.splice(0, path.length - 1);
	}

	static getFileExtensionFromRoute(route="", defaultExtension="") {
		if (!(typeof route === "string")) throw new TypeError("Route must be a string");
		const index = route.lastIndexOf(URL_SEPERATOR);
		const last = index === -1 ? route : route.substring(index);
		const seperatorIndex = last.lastIndexOf(FILE_SEPERATOR);
		return seperatorIndex === -1 ? defaultExtension : last.substring(seperatorIndex + 1).toLowerCase();
	}

	static getFileNameFromRoute(route="", query="") {
		if (typeof route !== "string" || typeof query !== "string") throw new TypeError("Route and query must be a string");
		const index = route.lastIndexOf(URL_SEPERATOR);
		const last = index === -1 ? route : route.substring(index + 1);
		const seperatorIndex = last.lastIndexOf(FILE_SEPERATOR);
		const first = seperatorIndex === -1 ? last : last.substring(0, seperatorIndex);
		const second = query.length > 0 ? "$" + query : "";
		return first + second;
	}

	static getUrlFileFactory(options={ pageFileExtension: "html" }) {
		return function(url) {
			if (typeof url === "string") url = new Url(url, options);
			if (!(url instanceof Url)) throw new Error("Url must be of Url type");

			const filePath = File.getFilePathFromRoute(url.route);
			const fileExtension = File.getFileExtensionFromRoute(url.route, options.pageFileExtension);
			const fileName = File.getFileNameFromRoute(url.route, url.query);
			return new File(filePath, fileExtension, fileName, url);
		}
	}

}

module.exports = File;