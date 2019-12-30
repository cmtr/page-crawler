const chai = require("chai");
const { expect } = chai; 
chai.should();

const Url = require("../src/url");
const File = require("../src/file");


describe("getFullFilePath", () => {

	const getFullFilePath = File.getFullFilePath;

	it("Expect ", () => {
		getFullFilePath(["folder", "subfolder"], "page", "html").should.equal("./folder/subfolder/page.html");
	});

	it("Expect to throw", () => {
		expect(getFullFilePath.bind({}, {}, "asdf", "asdf")).to.throw();
		expect(getFullFilePath.bind({}, "", "asdf", "asdf")).to.throw();
		expect(getFullFilePath.bind({}, [], 2, "asdf")).to.throw();
		expect(getFullFilePath.bind({}, [], "asdf", 2)).to.throw();
	})

});

describe("getFilePath", () => {

	const getFilePath = File.getFilePathFromRoute;

	it("Expect no-extension to return empty string", () => {
		const func1 = getFilePath("page/page/site.html");
		const res1 = [ "page", "page" ];
		checkArray(func1,res1);
	});

	function checkArray(check, result) {
		check.forEach((e, i) => e.should.equal(result[i]));
	}

});

describe("getFileExtension", () => {

	const getFileExtension = File.getFileExtensionFromRoute;

	it("Expect no-extension to return empty string", () => {
		getFileExtension("page/page").should.equal("");
	});

	it("Expect extension to be returned in lower case", () => {
		getFileExtension("page/page.html").should.equal("html");
		getFileExtension("page/page.Html").should.equal("html");
	});

	it("Page, no file extension", () => {
		getFileExtension("page/page/html", "php").should.equal("php");
	})

	it("Expect non-string to throw", () => {
		expect(getFileExtension.bind({}, 1)).to.throw();
		expect(getFileExtension.bind({}, [":"])).to.throw();
		expect(getFileExtension.bind({}, ["/"])).to.throw();
		expect(getFileExtension.bind({}, ["."])).to.throw();
	});

});

describe("getFileName", () => {

	const getFileName = File.getFileNameFromRoute;

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
		getFileName("/page/page.test.html", "v=234").should.equal("page.test$v=234");
	});

	it("Expect non-string to throw", () => {
		expect(getFileName.bind({}, 1)).to.throw();
		expect(getFileName.bind({}, [":"])).to.throw();
		expect(getFileName.bind({}, ["/"])).to.throw();
	});

});


describe("Factory", () => {

	

});
