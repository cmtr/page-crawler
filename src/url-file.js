const Url = require('./url');
const File = require('./file');

class UrlFile {


	constructor(oldUrl, newUrl, file, isPage=false) {
		this.oldUrl = oldUrl;
		this.newUrl = newUrl;
		this.file = file;
		this.isPage = isPage;
	}

	static modifyLocation(location) {
		let result = location;
		if (result.length > 0 && result[0] === ".")
			result = result.substring(1, result.length);
		if (result.length > 0 && result[0] === "/")
			result = result.substring(1, result.length);
		return result;
	}

	static getFactory(options={}) {
		
		const rootDirectory = options.rootDirectory || "";
		const pageFormats = options.pageFormats || ["html", "php", "asp"];
		const defaultIndexPageFileName = options.defaultIndexPageFileName || "index";
		const pageFileExtension = options.pageFileExtension || "html";
		const oldProtocal = options.oldProtocal || "http";
		const oldHost = options.oldHost || "localhost";
		const newProtocal = options.newProtocal || "http";
		const newHost = options.newHost || "localhost";


		const oldUrlFactory = Url.getFactory(oldProtocal,newHost);
		
		const fileFactory = File.getUrlFileFactory(rootDirectory, pageFileExtension, pageFormats, defaultIndexPageFileName);

		const newUrlFactory = Url.getFactory(newProtocal, newHost);

		return function(urlString) {
			const oldUrl = oldUrlFactory(urlString);
			const file = fileFactory(oldUrl);
			const location = UrlFile.modifyLocation(file.location);

			const newUrl = newUrlFactory(`${newProtocal}://${newHost}/${location}${oldUrl.hash.length > 0 ? "#" + oldUrl.hash : ""}`);
			return new UrlFile(oldUrl, newUrl, file);
		}
	}
}

module.exports = UrlFile;