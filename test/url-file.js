const chai = require("chai");
const { expect } = chai; 
chai.should();

const UrlFile = require("../src/url-file");
const { getFactory } = UrlFile;


describe("Factory", () => {

	const factory = UrlFile.getFactory();

	it("Factory should return function", () => {
		// getFactory({ options: "options" }).should.be.a.function;
	})

	it("Should return UrlFile", () => {
		factory("/page/page.html").should.be.instanceof(UrlFile);
	});

	it("Throw if not a string", () => {
		expect(factory.bind({})).to.throw();
		expect(factory.bind(1)).to.throw();
		expect(factory.bind([":"])).to.throw();
		expect(factory.bind(["/"])).to.throw();
	})

});