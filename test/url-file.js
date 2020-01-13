

const Test = require('./util');
const testUrl = Test.Url;
const testFile = Test.File;
const testUrlFile = Test.UrlFile;

const chai = require("chai");
const { expect } = chai; 
chai.should();

const UrlFile = require("../src/url-file");
const { getFactory } = UrlFile;


describe("UrlFile", () => {

	describe("Default Factory", () => {

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


			describe("External - Simple case - php", () => {
				const url = defaultFactory("https://test.com/folder/page.php");

				const result = {
					oldUrl: {
						url: "https://test.com/folder/page.php",
						protocal: "https",
						host: "test.com",
						isExternal: true,
						isIndex: false,
						route: "folder/page.php",
						query: "",
						hash: "",
						uniqueUrl: "https://test.com/folder/page.php",
						fullUrl: "https://test.com/folder/page.php"
					},
					file: {
						rootDirectory: "",
						filePath: ["com", "test","folder"],
						fileName: "page",
						fileExtension: "php",
						location: "./com/test/folder/page.php"
					},
					newUrl: {
						url: "http://localhost/com/test/folder/page.php",
						protocal: "http",
						host: "localhost",
						isExternal: false,
						isIndex: false,
						route: "com/test/folder/page.php",
						query: "",
						hash: "",
						uniqueUrl: "http://localhost/com/test/folder/page.php",
						fullUrl: "http://localhost/com/test/folder/page.php"
					}
				};

				testUrlFile(url, result);

			});		

			
		});


	});


	describe("Custom configuration", () => {
		
		const rootUrl = "http://localhost:3010";
		const directory = "cmtr/v1";
		const options = {
			rootDirectory: "cmtr/v1",
			oldHost: "localhost:3010",
			newHost: "localhost:4000"
		}


		const factory = UrlFile.getFactory(options);

		describe('Local - Simple Case', () => {

				const url = factory("/folder/page");
				
				const result = {
					oldUrl: {
						url: "/folder/page",
						protocal: "http",
						host: "localhost:3010",
						isExternal: false,
						isIndex: false,
						route: "folder/page",
						query: "",
						hash: "",
						uniqueUrl: "http://localhost:3010/folder/page",
						fullUrl: "http://localhost:3010/folder/page"
					},
					file: {
						rootDirectory: "cmtr/v1",
						filePath: ["folder"],
						fileName: "page",
						fileExtension: "html",
						location: "./cmtr/v1/folder/page.html",
						rootLocation: "./folder/page.html"
					},
					newUrl: {
						url: "http://localhost:4000/folder/page.html",
						protocal: "http",
						host: "localhost:4000",
						isExternal: false,
						isIndex: false,
						route: "folder/page.html",
						query: "",
						hash: "",
						uniqueUrl: "http://localhost:4000/folder/page.html",
						fullUrl: "http://localhost:4000/folder/page.html"
					}
				};

				testUrlFile(url, result);

		});


		describe('External - Simple Case', () => {

				const url = factory("https://test.com/folder/page");
				
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
						rootDirectory: "cmtr/v1",
						filePath: [ "com", "test", "folder"],
						fileName: "page",
						fileExtension: "html",
						location: "./cmtr/v1/com/test/folder/page.html",
						rootLocation: "./com/test/folder/page.html"
					},
					newUrl: {
						url: "http://localhost:4000/com/test/folder/page.html",
						protocal: "http",
						host: "localhost:4000",
						isExternal: false,
						isIndex: false,
						route: "com/test/folder/page.html",
						query: "",
						hash: "",
						uniqueUrl: "http://localhost:4000/com/test/folder/page.html",
						fullUrl: "http://localhost:4000/com/test/folder/page.html"
					}
				};

				testUrlFile(url, result);

		});

	})
	
});
