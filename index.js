const crawler = require('./src/crawler');

console.log("Start static page generator");

const rootUrl = "localhost:3010";

crawler("http://" + rootUrl, "./copy");