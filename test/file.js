const chai = require("chai");
const { expect } = chai; 
chai.should();

const Url = require("../src/url");
const File = require("../src/file");


describe("getFullFilePath", () => {

	const getFilePath = File.getFilePathFromUrl;

});

describe("getFilePathFromUrl", () => {

	const getFilePath = File.getFilePathFromUrl;

	it("Expect no-extension to return empty string", () => {
		// getFilePath("page/page").should.equal(["page"]);
	});

});

describe("getFileExtension", () => {

	const getFileExtension = File.getFileExtensionFromUrl;

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

	const getFileName = File.getFileNameFromUrl;

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

	it("Should not ignore query", () => {
		getFileName("/page/page.test.html?v=234#afg.sdf").should.equal("page.test$v=234");
	});

	it("Expect non-string to throw", () => {
		expect(getFileName.bind({})).to.throw();
		expect(getFileName.bind(1)).to.throw();
		expect(getFileName.bind([":"])).to.throw();
		expect(getFileName.bind(["/"])).to.throw();
	});

});

