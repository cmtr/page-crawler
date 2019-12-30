const chai = require("chai");
const { expect } = chai; 
chai.should();

const Url = require("../src/url");
const File = require("../src/file");


describe("Factory", () => {

	function testFile(fileObj, resultObj) {
		Object
			.keys(resultObj)
			.forEach(key => {
				if (Array.isArray(fileObj[key]))
					fileObj[key].forEach((e, i) => e.should.equal(resultObj[key][i]));
				else
					fileObj[key].should.equal(resultObj[key])
			});
	}

	describe("Url as String", () => {

		it("Internal", () => {
			const TEST = "/folder/page";

			const TEST_FILE_RESULT = {
				rootDirectory: "",
				filePath: ["folder"],
				fileName: "page",
				fileExtension: "html",
				location: "./folder/page.html"
			};

			testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);

		});

		it("With query", () => {

			const TEST = "/folder/page?v=123";

			const TEST_FILE_RESULT = {
				rootDirectory: "",
				filePath: ["folder"],
				fileName: "page$v=123",
				fileExtension: "html",
				location: "./folder/page$v=123.html"
			};

			testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);

		});

		it("Internal Index page", () => {
			const TEST = "/";

			const TEST_FILE_RESULT = {
				rootDirectory: "",
				filePath: [],
				fileName: "index",
				fileExtension: "html",
				location: "./index.html"
			};

			testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);

		});

		it("Internal Index page with query", () => {
			const TEST = "/?v=123";

			const TEST_FILE_RESULT = {
				rootDirectory: "",
				filePath: [],
				fileName: "index",
				fileExtension: "html",
				location: "./index$v=123.html"
			};

			testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);
		});


		it("External", () => {

			const TEST = "https://test.com/folder/page";

			const TEST_FILE_RESULT = {
				rootDirectory: "",
				filePath: ["test", "com", "folder"],
				fileName: "page",
				fileExtension: "html",
				location: "./test/com/folder/page.html"
			};

			testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);

		});

		it("External Index Page", () => {
			
			const TEST = "https://test.com/";

			const TEST_FILE_RESULT = {
				rootDirectory: "",
				filePath: ["test", "com"],
				fileName: "index",
				fileExtension: "html",
				location: "./test/com/index.html"
			};

			testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);
		});

		it("External Index Page with Query", () => {
			const TEST = "https://test.com?v=123";

			const TEST_FILE_RESULT = {
				rootDirectory: "",
				filePath: ["test", "com"],
				fileName: "index",
				fileExtension: "html",
				location: "./test/com/index$v=123.html"
			};

			testFile(File.getUrlFileFactory()(TEST), TEST_FILE_RESULT);
		});

	});

	describe("Url instance - default", () => {

	});

	describe("Url instance - custom", () => {

	});

});

describe("getFullFilePath", () => {

	const getFullFilePath = File.getFullFilePath;

	it("Expect", () => {
		getFullFilePath("footer", ["folder", "subfolder"], "page", "html").should.equal("./footer/folder/subfolder/page.html");
		getFullFilePath(undefined,["folder", "subfolder"], "page", "html").should.equal("./folder/subfolder/page.html");
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



