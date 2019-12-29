const URL_SEPERATOR = "/";
const HASH_SEPERATOR = "#";
const QUERY_SEPERATOR = "?";
const FILE_SEPERATOR = ".";
const EXTERNAL_KEYS = [ "http", "https" ];

function combined(ROOT_URL, isRootHttps, orgUrl) {
	const split = getUrl(orgUrl);
	const url = split[0];
	const extension = split[1];
	const urlArr = splitUrl(url);
	const external = isExternal(url);
	const fileExtension = getFileExtension(url);

	return {
		url,
		hash,
		query,
		path:  urlArr.splice(external ? 2 : 0, urlArr.length - 1),
		fileName: getFileName(url),
		fileExtension,
		isFile: fileExtension.length > 0,
		isPage: fileExtension === "html" || fileExtension.length === 0,
		isHtml: fileExtension === "html",
		isJavaScript: fileExtension === "js",
		isCss: fileExtension === "css",
		isExternal: external,
		isHttps: is(ROOT_URL, isRootHttps),
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

function getHash(url) {

}

function getQuery(url) {

}

function hasHash(url) {

}

function hasQuery(url) {

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


function isHttps(url, https=false) {
	const firstSeperator = url.indexOf(URL_SEPERATOR);
	if (firstSeperator <= 0) return https;
	const first = url.substring(0, firstSeperator).toLowerCase();
	return first === "https:" ? true : https;
}

function isPage(url) {
	const fileExtension = getFileExtension(url);
	return fileExtension === "html" || fileExtension.length === 0;
}

function isFile(url) {
	return getFileExtension(url).length > 0;
}

function isExternal(url, ROOT_URL="") {
	const firstSeperator = url.indexOf(URL_SEPERATOR);
	if (firstSeperator <= 0) return false;
	const first = url.substring(0, firstSeperator).toLowerCase();
	// TODO - Check of url root is same as local ROOT_URL
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
	isHttps,
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

/* 
const chai = require("chai");
chai.should();
const { 
	combined,
	getUrl, 
	splitUrl, 
	isExternal, 
	isRelative, 
	isFile, 
	getFileName, 
	getFileExtension, 
	isHtml, 
	isCss, 
	isJavaScript 
} = require("../src/url");


// HTML
const PAGE_TEST_STRING_1 = "/subfolder1/subfolder1-1/page1-1-1";
const PAGE_TEST_STRING_2 = "subfolder1-1/page1-1-1";
const PAGE_TEST_STRING_3 = "#someSection";
const PAGE_TEST_STRING_4 = "/subfolder1/subfolder1-1/page1-1-1#someSection";

const HTML_TEST_STRING_1 = "/subfoler1/subfolder1-1/page1-1-1.html";
const HTML_TEST_STRING_2 = "/subfoler1/subfolder1-1/page1-1-1.HTML";
const HTML_TEST_STRING_3 = "/subfoler1/subfolder1-1/page1-1-1.html#someSection";


// JS
const JS_TEST_STRING_1 = "/subfoler1/subfolder1-1/main.js";
const JS_TEST_STRING_2 = "/subfoler1/subfolder1-1/main.JS";

// CSS
const CSS_TEST_STRING_1 = "/subfoler1/subfolder1-1/main.css";
const CSS_TEST_STRING_2 = "/subfoler1/subfolder1-1/main.CSS";

// External

const EXTERNAL_PAGE_TEST_STRING_1 = "http://test.com/subfoler1/subfolder1-1/page1-1-1";
const EXTERNAL_PAGE_TEST_STRING_2 = "HTTP://test.com/subfoler1/subfolder1-1/page1-1-1";
const EXTERNAL_PAGE_TEST_STRING_3 = "https://test.com/subfoler1/subfolder1-1/page1-1-1";
const EXTERNAL_PAGE_TEST_STRING_4 = "HTTPS://test.com/subfoler1/subfolder1-1/page1-1-1";
const EXTERNAL_PAGE_TEST_STRING_5 = "HTTPS://test.com/subfoler1/subfolder1-1/page1-1-1.html#someSection";

const EXTERNAL_PAGE_TEST_STRING_6 = "HTTPS://test.com/subfoler1/subfolder1-1/page1-1-1.html?v=123#someSection";

const ROOT_URL = "localhost:4000";


const EXTERNAL_PAGE_TEST_STRING_7 = "HTTPS://test.com/subfolder1/subfolder1-1/page1-1-1?v=123#someSection";

const EXTERNAL_PAGE_TEST_STRING_7_RESULT = {
	isHttps: true,
	rootUrl: "test.com",
	path: [ "subfolder1", "subfolder1-1" ],
	hasQuery: true,
	query: "v=123",
	hasHash: true,
	hash: "someSection",
	oldRoute: "/subfolder1/subfolder1-1/page1-1-1?v=123#someSection",
	newRoute: "/subfolder1/subfolder1-1/page1-1-1@v=123.html#someSection",
	oldFileName: "page1-1-1",
	fileName: "page1-1-1@v=123",
	fileExtension: "html",
	file: "page1-1-1@v=123.html"
}


describe("combined", () => {

	it("PAGE_TEST_STRING_1", () => {
		const url = combined(ROOT_URL, PAGE_TEST_STRING_1);
		url.url.should.equal(PAGE_TEST_STRING_1);
		url.extension.should.have.lengthOf(0);
		url.path[0].should.equal("subfolder1");
		url.path[1].should.equal("subfolder1-1");
		url.fileName.should.equal("page1-1-1");
		url.fileExtension.should.have.lengthOf(0);
		url.rootUrl.should.equal(ROOT_URL);
		url.isPage.should.be.true;
		url.isFile.should.be.false;
		url.isHtml.should.be.false;
		url.isJavaScript.should.be.false;
		url.isCss.should.be.false;
		url.isExternal.should.be.false;
		url.isRelative.should.be.false;
	});

	it("PAGE_TEST_STRING_4", () => {
		const url = combined(ROOT_URL, PAGE_TEST_STRING_4);
		url.url.should.equal("/subfolder1/subfolder1-1/page1-1-1");
		url.extension.should.equal("#someSection");
		url.path[0].should.equal("subfolder1");
		url.path[1].should.equal("subfolder1-1");
		url.fileName.should.equal("page1-1-1");
		url.fileExtension.should.have.lengthOf(0);
		url.rootUrl.should.equal(ROOT_URL);
		url.isPage.should.be.true;
		url.isFile.should.be.false;
		url.isHtml.should.be.false;
		url.isJavaScript.should.be.false;
		url.isCss.should.be.false;
		url.isExternal.should.be.false;
		url.isRelative.should.be.false;
	});

	it("HTML_TEST_STRING_3", () => {
		const url = combined(ROOT_URL, HTML_TEST_STRING_3);
		url.url.should.equal("/subfoler1/subfolder1-1/page1-1-1.html");
		url.extension.should.equal("#someSection");
		url.path[0].should.equal("subfoler1");
		url.path[1].should.equal("subfolder1-1");
		url.fileName.should.equal("page1-1-1");
		url.fileExtension.should.equal("html");
		url.rootUrl.should.equal(ROOT_URL);
		url.isPage.should.be.true;
		url.isFile.should.be.true;
		url.isHtml.should.be.true;
		url.isJavaScript.should.be.false;
		url.isCss.should.be.false;
		url.isExternal.should.be.false;
		url.isRelative.should.be.false;
	});

	it("EXTERNAL_PAGE_TEST_STRING_5", () => {
		const url = combined(ROOT_URL, EXTERNAL_PAGE_TEST_STRING_5);
		url.url.should.equal("https://test.com/subfoler1/subfolder1-1/page1-1-1.html");
		url.extension.should.equal("#someSection");
		url.path[0].should.equal("subfoler1");
		url.path[1].should.equal("subfolder1-1");
		url.fileName.should.equal("page1-1-1");
		url.fileExtension.should.equal("html");
		url.rootUrl.should.equal("test.com");
		url.isPage.should.be.true;
		url.isFile.should.be.true;
		url.isHtml.should.be.true;
		url.isJavaScript.should.be.false;
		url.isCss.should.be.false;
		url.isExternal.should.be.true;
		url.isRelative.should.be.false;
	});

});

describe("getUrl", () => {

	it("PAGE_TEST_STRING_1", () => {
		const arr = getUrl(PAGE_TEST_STRING_1);
		arr[0].should.equal(PAGE_TEST_STRING_1);
		arr[1].should.have.lengthOf(0);
		arr.should.have.lengthOf(2);
	});

	it("PAGE_TEST_STRING_3", () => {
		const arr = getUrl(PAGE_TEST_STRING_3);
		arr[0].should.have.lengthOf(0);
		arr[1].should.equal(PAGE_TEST_STRING_3);
		arr.should.have.lengthOf(2);
	});

	it("PAGE_TEST_STRING_4", () => {
		const arr = getUrl(PAGE_TEST_STRING_4);
		arr[0].should.equal("/subfolder1/subfolder1-1/page1-1-1");
		arr[1].should.equal("#someSection");
		arr.should.have.lengthOf(2);
	});

});

describe("splitUrl", () => {

	it("Empty string", () => {
		const arr = splitUrl("");
		arr.should.have.lengthOf(0);
	});

	it("PAGE_TEST_STRING_1", () => {
		const arr = splitUrl(PAGE_TEST_STRING_1)
		arr.should.have.lengthOf(3);
		arr[0].should.equal("subfolder1");
		arr[1].should.equal("subfolder1-1");
		arr[2].should.equal("page1-1-1");
	});

	it("PAGE_TEST_STRING_2", () => {
		const arr = splitUrl(PAGE_TEST_STRING_2)
		arr.should.have.lengthOf(2);
		arr[0].should.equal("subfolder1-1");
		arr[1].should.equal("page1-1-1");
	});

});

describe("isRelative", () => {

	it("Empty string", () => {
		isRelative("").should.be.false;
	});

	it("External", () => {
		isRelative(EXTERNAL_PAGE_TEST_STRING_1).should.be.false;
	});


	it("Relative", () => {
		isRelative(PAGE_TEST_STRING_2).should.be.true;
	});

	it("Local - not relative", () => {
		isRelative(PAGE_TEST_STRING_1).should.be.false;
	});

});

describe("isExternal", () => {

	it("http - lower case", () => {
		isExternal(EXTERNAL_PAGE_TEST_STRING_1).should.be.true;
	});
	
	it("http - upper case", () => {
		isExternal(EXTERNAL_PAGE_TEST_STRING_2).should.be.true;
	});
	
	it("https - lower case", () => {
		isExternal(EXTERNAL_PAGE_TEST_STRING_3).should.be.true;
	});
	
	it("https - upper case", () => {
		isExternal(EXTERNAL_PAGE_TEST_STRING_4).should.be.true;
	});

	it("internal url", () => {
		isExternal(PAGE_TEST_STRING_1).should.be.false;
		isExternal(PAGE_TEST_STRING_2).should.be.false;
		isExternal(PAGE_TEST_STRING_3).should.be.false;
		isExternal(PAGE_TEST_STRING_4).should.be.false;
	});

	it("Empty string", () => {
		isExternal("").should.be.false;
	})

});

describe("isFile", () => {

	it("Not file", () => {
		isFile(PAGE_TEST_STRING_1).should.be.false;
		isFile(PAGE_TEST_STRING_2).should.be.false;
	});

	it("Is file", () => {
		isFile(HTML_TEST_STRING_1).should.be.true;
		isFile(HTML_TEST_STRING_2).should.be.true;
	});

	it("Empty string", () => {
		isFile("").should.be.false;
	})

});

describe("getFileName", () => {

	it("Not file", () => {
		getFileExtension(PAGE_TEST_STRING_1)
		getFileExtension(PAGE_TEST_STRING_2)
	})

	it("Lower case", () => {
		getFileName(HTML_TEST_STRING_1).should.equal("page1-1-1");
	});

	it("Multiple seperators", () => {
		getFileName(JS_TEST_STRING_1 + ".test.html").should.equal("main.js.test");
	});

	it("Empty string", () => {
		getFileName("").should.have.lengthOf(0);
	})

});

describe("getFileExtension", () => {

	it("Not file", () => {
		getFileExtension(PAGE_TEST_STRING_1).should.have.lengthOf(0);
		getFileExtension(PAGE_TEST_STRING_2).should.have.lengthOf(0);
	})

	it("Lower case", () => {
		getFileExtension(HTML_TEST_STRING_1).should.equal("html");
	});

	it("Upper case", () => {
		getFileExtension(HTML_TEST_STRING_1).should.equal("html");
	});

	it("Multiple seperators", () => {
		getFileExtension(JS_TEST_STRING_1 + ".test.html").should.equal("html");
	});

	it("Empty string", () => {
		getFileExtension("").should.have.lengthOf(0);
	})

});

describe("isHtml", () => {

	it("Html", () => {
		isHtml(HTML_TEST_STRING_2).should.be.true;
	});

	it("Not html", () => {
		isHtml(CSS_TEST_STRING_2).should.be.false;
		isHtml("").should.be.false;
	});

});

describe("isJavaScript", () => {

	it("JavaScript", () => {
		isJavaScript(JS_TEST_STRING_2).should.be.true;
	});

	it("Not JavaScript", () => {
		isJavaScript(CSS_TEST_STRING_2).should.be.false;
	});

});

describe("isCss", () => {

	it("CSS", () => {
		isCss(CSS_TEST_STRING_2).should.be.true;
	});

	it("Not CSS", () => {
		isCss(JS_TEST_STRING_2).should.be.false;
	});

});
*/