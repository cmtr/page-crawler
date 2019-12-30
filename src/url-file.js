const Url = require('./url');
const File = require('./file');

class UrlFile {


	constructor(oldUrl, newUrl, file, isPage=false) {
		this.oldUrl = oldUrl;
		this.newUrl = newUrl;
		this.file = file;
		this.isPage = isPage;
	}

	static getFactory(options) {
		const urlFactory = Url.getFactory(options);
		const fileFactory = File.getUrlFileFactory(options);
		return function(urlString) {
			const oldUrl = urlFactory(urlString);
			const file = fileFactory(oldUrl);
			const newUrl = urlFactory(`${file.location}${oldUrl.hash.length > 0 ? "#" + oldUrl.hash : ""}`);
			return new UrlFile(oldUrl, newUrl, file);
		}
	}
}

module.exports = UrlFile;