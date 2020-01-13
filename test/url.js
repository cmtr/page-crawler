const chai = require("chai");
const { expect } = chai; 
chai.should();

const Test = require('./util');
const testUrl = Test.Url;

const Url = require("../src/url");

describe("Url", () => {

	describe("Factory", () => {
		
		describe("Default Factory", () => {

			const factory = Url.getFactory();

			it("Advanced test string", () => {
				const EXTERNAL_PAGE_TEST_STRING_1 = "HTTPS://test.com/subfolder1/subfolder1-1/page1-1-1?v=123#someSection";

				const EXTERNAL_PAGE_TEST_STRING_1_RESULT = {
					url: "https://test.com/subfolder1/subfolder1-1/page1-1-1",
					protocal: "https",
					host: "test.com",
					isExternal: true,
					isIndex: false,
					route: "subfolder1/subfolder1-1/page1-1-1",
					query: "v=123",
					hash: "someSection",
					uniqueUrl: "https://test.com/subfolder1/subfolder1-1/page1-1-1?v=123",
					fullUrl: "https://test.com/subfolder1/subfolder1-1/page1-1-1?v=123#someSection"
				};

				testUrl(factory(EXTERNAL_PAGE_TEST_STRING_1), EXTERNAL_PAGE_TEST_STRING_1_RESULT);
			})

			it("Defaults", () => {
				const INTERNAL_TEST_STRING = "/folder/page";

				const INTERNAL_TEST_STRING_RESULT = {
					url: "/folder/page",
					isExternal: false,
					isIndex: false,
					protocal: "http",
					host: "localhost",
					route: "folder/page",
					query: "",
					hash: "",
					uniqueUrl: "http://localhost/folder/page",
					fullUrl: "http://localhost/folder/page",
				};

				testUrl(factory(INTERNAL_TEST_STRING), INTERNAL_TEST_STRING_RESULT);
			});

			it("Defaults - Index", () => {
				const INTERNAL_TEST_STRING = "/";

				const INTERNAL_TEST_STRING_RESULT = {
					url: "/",
					isExternal: false,
					isIndex: true,
					protocal: "http",
					host: "localhost",
					route: "",
					query: "",
					hash: "",
					uniqueUrl: "http://localhost",
					fullUrl: "http://localhost",
				};

				testUrl(factory(INTERNAL_TEST_STRING), INTERNAL_TEST_STRING_RESULT);
			});


			it("External - Index", () => {
				const INTERNAL_TEST_STRING = "http://test.com";

				const INTERNAL_TEST_STRING_RESULT = {
					url: "http://test.com",
					isExternal: true,
					isIndex: true,
					protocal: "http",
					host: "test.com",
					route: "",
					query: "",
					hash: "",
					uniqueUrl: "http://test.com",
					fullUrl: "http://test.com",
				};

				testUrl(factory(INTERNAL_TEST_STRING), INTERNAL_TEST_STRING_RESULT);
			});

		});

		describe("Custom Factory", () => {

			it("Protocal", () => {
				const url = Url.getFactory("https")("folder/page");
				const result = {
					url: "folder/page",
					protocal: "https",
					isExternal: false,
					isIndex: false,
					host: "localhost",
					route: "folder/page",
					query: "",
					hash: "",
					uniqueUrl: "https://localhost/folder/page",
					fullUrl: "https://localhost/folder/page",
				};
				testUrl(url, result);
			});

			it("Host", () => {
				const url = Url.getFactory(undefined, "test.com")("folder/page");
				const result = {
					url: "folder/page",
					protocal: "http",
					isExternal: false,
					isIndex: false,
					host: "test.com",
					route: "folder/page",
					query: "",
					hash: "",
					uniqueUrl: "http://test.com/folder/page",
					fullUrl: "http://test.com/folder/page",
				};
				testUrl(url, result);
			});

			it("Protocal & Host", () => {

			});

		});

	})


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

	describe("getUniqueUrl", () => {
		const getUniqueUrl = Url.getUniqueUrl;


		it("Simple url", () => {
			getUniqueUrl("http", "test.com").should.equal("http://test.com");
		});

		it("With pages", () => {
			getUniqueUrl("http", "test.com", "folder/page.html").should.equal("http://test.com/folder/page.html");
		});

		it("With relative path", () => {
			getUniqueUrl("http", "test.com", "/folder/page.html").should.equal("http://test.com/folder/page.html");
		});

		it("With query", () => {
			getUniqueUrl("http", "test.com", "folder/page.html", "c=23r4s").should.equal("http://test.com/folder/page.html?c=23r4s");
		});

		it("Expect non-string to throw", () => {
			expect(getUniqueUrl.bind({}, {})).to.throw();
			expect(getUniqueUrl.bind({}, 1)).to.throw();
			expect(getUniqueUrl.bind({}, ["asd",":"])).to.throw();
			expect(getUniqueUrl.bind({}, [":"])).to.throw();
		});

	})

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


		it("Localhost", () => {
			getHost("http://localhost:3000/page", "localhost").should.equal("localhost:3000");
		})

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


});