const chai = require("chai");
const { expect } = chai; 
chai.should();

const UrlFile = require("../src/url-file");
const { getFactory } = UrlFile;

const Test = {};

Test.Url = function(urlObj, result) {
	describe("Url", () => {
		Object
			.keys(result)
			.forEach(key => {
				it(key, () => {
					urlObj[key].should.equal(result[key]);
				});
			});	
	})
	
}



Test.File = function(fileObj, resultObj) {
	describe("File", () => {
		Object
		.keys(resultObj)
		.forEach(key => {
			it(key, () => {
				if (Array.isArray(fileObj[key]))
					fileObj[key].forEach((e, i) => e.should.equal(resultObj[key][i]));
				else
					fileObj[key].should.equal(resultObj[key])	
			});
		});	
	});
	
}


Test.UrlFile = function(testObj, resultObj) {

	describe("UrlFile", () => {
		
		describe("Old Url", () => {
			Test.Url(testObj.oldUrl, resultObj.oldUrl);
		});

		describe("New Url", () => {
			Test.Url(testObj.newUrl, resultObj.newUrl);
		});

		describe("File", () => {
			Test.File(testObj.file, resultObj.file);	
		});	
	});
	
}

module.exports = Test;