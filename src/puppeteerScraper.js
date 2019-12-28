const axios = require('axios');
const puppeteer = require('puppeteer');

let browser = undefined;

function get(url) {
	return axios.get(url);
}

function getPage(url) {

	return puppeteer
		.launch()
		.then(browser => browser.newPage())
}

module.exports = {
	get, render
}