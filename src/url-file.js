const Url = require('./url');
const File = require('./file');

class UrlFile {


	constructor(oldUrl, newUrl, file, isPage=false) {
		this.oldUrl = oldUrl;
		this.newUrl = newUrl;
		this.file = file;
		this.isPage = isPage;
	}

	static getFactory(options={
		oldProtocal: "http",
		newProtocal: "http",
		oldHost: "localhost",
		newHost: "localhost",
		rootDirectory: "",
		pageFormats: ["html", "php"],
		defaultIndexPageFileName: "index",
		pageFileExtension: "html"
	}) {
		
		const oldUrlFactory = Url.getFactory(options.oldProtocal,options.newHost);
		
		const fileFactory = File.getUrlFileFactory(options.rootDirectory, options.pageFileExtension, options.pageFormats, options.defaultIndexPageFileName);

		const newUrlFactory = Url.getFactory(options.newProtocal, options.newHost);

		return function(urlString) {
			const oldUrl = oldUrlFactory(urlString);
			const file = fileFactory(oldUrl);
			const newUrl = newUrlFactory(`${file.location}${oldUrl.hash.length > 0 ? "#" + oldUrl.hash : ""}`);
			return new UrlFile(oldUrl, newUrl, file);
		}
	}
}

module.exports = UrlFile;