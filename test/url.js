const chai = require("chai");
const { expect } = chai; 
chai.should();

const Url = require("../src/url");

const EXTERNAL_PAGE_TEST_STRING_1 = "HTTPS://test.com/subfolder1/subfolder1-1/page1-1-1?v=123#someSection";

const EXTERNAL_PAGE_TEST_STRING_1_RESULT = {
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


describe("getFullUrl", () => {

	const getFullUrl= Url.getFullUrl;

	it("All variables", () => {
		getFullUrl("http", "test.com", "blog/page", "v=123", "section").should.equal("http://test.com/blog/page?v=123#section");
		getFullUrl("http", "test.com", "/blog/page", "v=123", "section").should.equal("http://test.com/blog/page?v=123#section");
		getFullUrl("http", "test.com/", "blog/page", "v=123", "section").should.equal("http://test.com/blog/page?v=123#section");
	});

	it("All variables", () => {
		getFullUrl("http", "test.com", "blog/page").should.equal("http://test.com/blog/page");
		getFullUrl("http", "test.com", "/blog/page", undefined, "section").should.equal("http://test.com/blog/page#section");
		getFullUrl("http", "test.com/", "blog/page", "v=123").should.equal("http://test.com/blog/page?v=123");
	});

	it("Expect non-string to throw", () => {

	});

});

describe("getProtocol", () => {

	const getProtocol = Url.getProtocol;

	it("Expect upper case to be lower case", () => {
		getProtocol("HTTPS://").should.equal("https");
	});

	it("Expect empty string without protocol", () => {
		getProtocol("/test/test").should.have.lengthOf(0);
		getProtocol("/test/test").should.equal("");
	});

	it("Expect non-string to throw", () => {
		expect(getProtocol.bind({}, {})).to.throw();
		expect(getProtocol.bind({}, 1)).to.throw();
		expect(getProtocol.bind({}, ["asd",":"])).to.throw();
		expect(getProtocol.bind({}, [":"])).to.throw();
	});

})

describe("getUrl", () => {

	const getUrl = Url.getUrl;

	it("Local routing", () => {
		getUrl("/page/page.test.html?v=234#afg.sdf").should.equal("/page/page.test.html");
	});

	it("External routing", () => {
		getUrl("http://test.com/page/page.test.html?v=234#afg.sdf").should.equal("http://test.com/page/page.test.html");
	});

	it("External routing - Lower case", () => {
		getUrl("http://test.com/PAGE/page.test.html?v=234#afg.sdf").should.equal("http://test.com/page/page.test.html");
	});

	it("Expect non-string to throw", () => {
		expect(getUrl.bind({}, {})).to.throw();
		expect(getUrl.bind({}, 1)).to.throw();
		expect(getUrl.bind({}, ["asd",":"])).to.throw();
		expect(getUrl.bind({}, [":"])).to.throw();
	});


});

describe("getHost", () => {

	const getHost = Url.getHost;


	it("Local routing", () => {
		getHost("/page/page.test.html?v=234#afg.sdf").should.equal("");
	});

	it("External routing", () => {
		getHost("http://test.com/page/page.test.html?v=234#afg.sdf").should.equal("test.com");
	});

	it("Expect non-string to throw", () => {
		expect(getHost.bind({}, {})).to.throw();
		expect(getHost.bind({}, 1)).to.throw();
		expect(getHost.bind({}, ["asd",":"])).to.throw();
		expect(getHost.bind({}, [":"])).to.throw();
	});

});

describe("getRoute", () => {

	const getRoute = Url.getRoute;

	it("Local routing", () => {
		getRoute("/page/page.test.html?v=234#afg.sdf").should.equal("page/page.test.html");
	});

	it("External routing", () => {
		getRoute("http://test.com/page/page.test.html?v=234#afg.sdf").should.equal("page/page.test.html");
	});

	it("External routing", () => {
		getRoute("http://test.com/page/page/").should.equal("page/page");
	});

	it("Expect non-string to throw", () => {
		expect(getRoute.bind({}, {})).to.throw();
		expect(getRoute.bind({}, 1)).to.throw();
		expect(getRoute.bind({}, ["asd",":"])).to.throw();
		expect(getRoute.bind({}, [":"])).to.throw();
	});


});


describe("getQuery", () => {

	const getQuery = Url.getQuery;

	it("Local routing", () => {
		getQuery("/page/page.test.html?v=234#afg.sdf").should.equal("v=234");
	});

	it("Expect non-string to throw", () => {
		expect(getQuery.bind({}, {})).to.throw();
		expect(getQuery.bind({}, 1)).to.throw();
		expect(getQuery.bind({}, ["asd",":"])).to.throw();
		expect(getQuery.bind({}, [":"])).to.throw();
	});

});


describe("getHash", () => {

	const getHash = Url.getHash;

	it("Local routing", () => {
		getHash("/page/page.test.html?v=234#afg.sdf").should.equal("afg.sdf");
	});

	it("Expect non-string to throw", () => {
		expect(getHash.bind({}, {})).to.throw();
		expect(getHash.bind({}, 1)).to.throw();
		expect(getHash.bind({}, ["asd",":"])).to.throw();
		expect(getHash.bind({}, [":"])).to.throw();
	});

});




describe("getFileExtension", () => {

	const getFileExtension = Url.getFileExtension;

	it("Expect no-extension to return empty string", () => {
		getFileExtension("page/page").should.equal("");
	});

	it("Expect extension to be returned in lower case", () => {
		getFileExtension("page/page.html").should.equal("html");
		getFileExtension("page/page.Html").should.equal("html");
	});


	it("Expect non-string to throw", () => {
		expect(getFileExtension.bind({})).to.throw();
		expect(getFileExtension.bind(1)).to.throw();
		expect(getFileExtension.bind([":"])).to.throw();
		expect(getFileExtension.bind(["/"])).to.throw();
		expect(getFileExtension.bind(["."])).to.throw();
	});

});

describe("getFileName", () => {

	const getFileName = Url.getFileName;

	it("No path should equal self", () => {
		getFileName("page").should.equal("page");
	});

	it("Should include last leg", () => {
		getFileName("/page/page").should.equal("page");
	});

	it("Should include last leg", () => {
		getFileName("/page/page.html").should.equal("page");
	});

	it("Should allow for multiple periods", () => {
		getFileName("/page/page.test.html").should.equal("page.test");
	});

	it("Should ignore query & hash", () => {
		getFileName("/page/page.test.html?v=234#afg.sdf").should.equal("page.test");
	});

	it("Expect non-string to throw", () => {
		expect(getFileName.bind({})).to.throw();
		expect(getFileName.bind(1)).to.throw();
		expect(getFileName.bind([":"])).to.throw();
		expect(getFileName.bind(["/"])).to.throw();
	});

});

