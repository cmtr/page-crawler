const Url = require('./url');
const File = require('./file');


class UrlFile {

	constructor(oldUrl, newUrl, file, isPage=false) {
		this.oldUrl = oldUrl;
		this.newUrl = newUrl;
		this.file = file;
		this.isPage = isPage;
	}

}

UrlFile.modifyLocation = function(location) {
	let result = location;
	if (result.length > 0 && result[0] === ".")
		result = result.substring(1, result.length);
	if (result.length > 0 && result[0] === "/")
		result = result.substring(1, result.length);
	return result;
}


UrlFile.isPagePredicate = function(pageFormats=[], fileExtension) {
	return pageFormats.some(format => fileExtension === format);
}


UrlFile.getFactory = function(options={}) {
	
	const rootDirectory = options.rootDirectory || "";
	const pageFormats = options.pageFormats || ["html", "php", "asp"];
	const indexPageFileName = options.indexPageFileName || "index";
	const pageFileExtension = options.pageFileExtension || "html";
	const oldProtocal = options.oldProtocal || "http";
	const oldHost = options.oldHost || "localhost";
	const newProtocal = options.newProtocal || "http";
	const newHost = options.newHost || "localhost";

	const oldUrlFactory = Url.getFactory(oldProtocal, oldHost);
	const fileFactory = File.getUrlFileFactory(rootDirectory, pageFileExtension, pageFormats, indexPageFileName);
	const newUrlFactory = Url.getFactory(newProtocal, newHost);

	return function(urlString) {
		const oldUrl = oldUrlFactory(urlString);
		const file = fileFactory(oldUrl);
		const location = UrlFile.modifyLocation(file.rootLocation);
		const newUrl = newUrlFactory(`${newProtocal}://${newHost}/${location}${oldUrl.hash.length > 0 ? "#" + oldUrl.hash : ""}`);
		const isPage = UrlFile.isPagePredicate(pageFormats, file.fileExtension);
		// return { oldUrl, newUrl, file, isPage }

		return new UrlFile(oldUrl, newUrl, file, isPage);
	}
}



module.exports = UrlFile;