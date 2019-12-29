const Url = require("./url");

const URL_SEPERATOR = "/";
const HASH_SEPERATOR = "#";
const QUERY_SEPERATOR = "?";
const FILE_SEPERATOR = ".";
const PROTOCOL_SEPERATOR = ":";

class File {

	constructor(filePath, fileExtension, fileName) {
		this.filePath = filePath
		this.fileExtension = fileExtension;
		this.fileName = fileName;
		this.location = getFullFilePath(this.filePath, this.fileName, this.fileExtension)
	}

	static getFullFilePath(filePath=[], fileName="", fileExtension="") {
		return `./${filePath.join("/")}/${fileName}.${fileExtension}`
	}

	static getFilePathFromUrl(route, defaultExtension="") {
		const path = route.split(URL_SEPERATOR);
		path.pop();
		return path;
	}

	static getFileExtensionFromUrl(url, defaultExtension="", options) {
		if (typeof url === "string") url = new Url(url, options);
		const  { route } = url;
		const index = route.lastIndexOf(URL_SEPERATOR);
		const last = index === -1 ? route : route.substring(index);
		const seperatorIndex = last.lastIndexOf(FILE_SEPERATOR);
		return seperatorIndex === -1 ? defaultExtension : last.substring(seperatorIndex + 1).toLowerCase();
	}

	static getFileNameFromUrl(url, options) {
		if (typeof url === "string") url = new Url(url, options);
		const  { route, query } = url;
		const index = route.lastIndexOf(URL_SEPERATOR);
		const last = index === -1 ? route : route.substring(index + 1);
		const seperatorIndex = last.lastIndexOf(FILE_SEPERATOR);
		const first = seperatorIndex === -1 ? last : last.substring(0, seperatorIndex);
		const second = query.length > 0 ? "$" + query : "";
		return first + second;
	}

	static getUrlFileFactory(options) {
		return function(url) {
			if (typeof url === "string") url = new Url(url, options);
			if (!(url instanceof Url)) throw new Error("Url must be of Url type");

			const filePath = File.getFilePathFromUrl(url.route);
			const fileExtension = File.getFileExtensionFromUrl(url.url, fileExtension);
			const fileName = File.getFileNameFromUrl(url);
			return new File(filePath, fileExtension, fileName);
		}
	}

}

module.exports = File;