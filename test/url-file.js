const chai = require("chai");
const { expect } = chai; 
chai.should();

const UrlFile = require("../src/url-file");
const { getFactory } = UrlFile;

function testUrl(urlObj, result) {
	Object
		.keys(result)
		.forEach(key => urlObj[key].should.equal(result[key]));
}



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


function testUrlFile(testObj, resultObj) {

	it("Old Url", () => {
		testUrl(testObj.oldUrl, resultObj.oldUrl);
	});

	it("New Url", () => {
		testUrl(testObj.newUrl, resultObj.newUrl);
	});

	it("File", () => {
		testFile(testObj.file, resultObj.file);	
	});
	
}



describe("UrlFile", () => {

	describe("Factory", () => {

		const defaultFactory = UrlFile.getFactory();

		it("Factory should return function", () => {
			// getFactory({ options: "options" }).should.be.a.function;
		})

		it("Should return UrlFile", () => {
			defaultFactory("root","/page/page.html").should.be.instanceof(UrlFile);
		});

		it("Throw if not a string", () => {
			expect(defaultFactory.bind({})).to.throw();
			expect(defaultFactory.bind(1)).to.throw();
			expect(defaultFactory.bind([":"])).to.throw();
			expect(defaultFactory.bind(["/"])).to.throw();
		});


		describe("Default factory", () => {

			describe("Local - Simple case", () => {
				const url = defaultFactory("/folder/page");
				
				const result = {
					oldUrl: {
						url: "/folder/page",
						protocal: "http",
						host: "localhost",
						isExternal: false,
						isIndex: false,
						route: "folder/page",
						query: "",
						hash: "",
						uniqueUrl: "http://localhost/folder/page",
						fullUrl: "http://localhost/folder/page"
					},
					file: {
						rootDirectory: "",
						filePath: ["folder"],
						fileName: "page",
						fileExtension: "html",
						location: "./folder/page.html"
					},
					newUrl: {
						url: "http://localhost/folder/page.html",
						protocal: "http",
						host: "localhost",
						isExternal: false,
						isIndex: false,
						route: "folder/page.html",
						query: "",
						hash: "",
						uniqueUrl: "http://localhost/folder/page.html",
						fullUrl: "http://localhost/folder/page.html"
					}
				};

				testUrlFile(url, result);

			});

			describe("Local - Index case", () => {
				const url = defaultFactory("/");
				
				const result = {
					oldUrl: {
						url: "/",
						protocal: "http",
						host: "localhost",
						isExternal: false,
						isIndex: true,
						route: "",
						query: "",
						hash: "",
						uniqueUrl: "http://localhost",
						fullUrl: "http://localhost"
					},
					file: {
						rootDirectory: "",
						filePath: [],
						fileName: "index",
						fileExtension: "html",
						location: "./index.html"
					},
					newUrl: {
						url: "http://localhost/index.html",
						protocal: "http",
						host: "localhost",
						isExternal: false,
						isIndex: false,
						route: "index.html",
						query: "",
						hash: "",
						uniqueUrl: "http://localhost/index.html",
						fullUrl: "http://localhost/index.html"
					}
				};

				testUrlFile(url, result);
				
			});


			describe("Local - Index case with query and hash", () => {
				const url = defaultFactory("/?v=13#section");
				
				const result = {
					oldUrl: {
						url: "/",
						protocal: "http",
						host: "localhost",
						isExternal: false,
						isIndex: true,
						route: "",
						query: "v=13",
						hash: "section",
						uniqueUrl: "http://localhost?v=13",
						fullUrl: "http://localhost?v=13#section"
					},
					file: {
						rootDirectory: "",
						filePath: [],
						fileName: "index$v=13",
						fileExtension: "html",
						location: "./index$v=13.html"
					},
					newUrl: {
						url: "http://localhost/index$v=13.html",
						protocal: "http",
						host: "localhost",
						isExternal: false,
						isIndex: false,
						route: "index$v=13.html",
						query: "",
						hash: "section",
						uniqueUrl: "http://localhost/index$v=13.html",
						fullUrl: "http://localhost/index$v=13.html#section"
					}
				};

				testUrlFile(url, result);
				
			});

			describe("External - Simple case", () => {
				const url = defaultFactory("https://test.com/folder/page");

				const result = {
					oldUrl: {
						url: "https://test.com/folder/page",
						protocal: "https",
						host: "test.com",
						isExternal: true,
						isIndex: false,
						route: "folder/page",
						query: "",
						hash: "",
						uniqueUrl: "https://test.com/folder/page",
						fullUrl: "https://test.com/folder/page"
					},
					file: {
						rootDirectory: "",
						filePath: ["com", "test","folder"],
						fileName: "page",
						fileExtension: "html",
						location: "./com/test/folder/page.html"
					},
					newUrl: {
						url: "http://localhost/com/test/folder/page.html",
						protocal: "http",
						host: "localhost",
						isExternal: false,
						isIndex: false,
						route: "com/test/folder/page.html",
						query: "",
						hash: "",
						uniqueUrl: "http://localhost/com/test/folder/page.html",
						fullUrl: "http://localhost/com/test/folder/page.html"
					}
				};

				testUrlFile(url, result);

			});


			describe("External - Index case with query and hash", () => {
				const url = defaultFactory("https://test.com/?v=13#section");
				
				const result = {
					oldUrl: {
						url: "https://test.com/",
						protocal: "https",
						host: "test.com",
						isExternal: true,
						isIndex: true,
						route: "",
						query: "v=13",
						hash: "section",
						uniqueUrl: "https://test.com?v=13",
						fullUrl: "https://test.com?v=13#section"
					},
					file: {
						rootDirectory: "",
						filePath: ["com", "test"],
						fileName: "index$v=13",
						fileExtension: "html",
						location: "./com/test/index$v=13.html"
					},
					newUrl: {
						url: "http://localhost/com/test/index$v=13.html",
						protocal: "http",
						host: "localhost",
						isExternal: false,
						isIndex: false,
						route: "com/test/index$v=13.html",
						query: "",
						hash: "section",
						uniqueUrl: "http://localhost/com/test/index$v=13.html",
						fullUrl: "http://localhost/com/test/index$v=13.html#section"
					}
				};

				testUrlFile(url, result);
				
			});


		});

	});
	
});
