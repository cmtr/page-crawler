const PageTransform = {};

const DEFAULT_TAG_KEY_PAIRS = [
	{ tag: "a", key: "href" },
	{ tag: "script", key: "src" },
	{ tag: "script", key: "href" },
	{ tag: "link", key: "src" },
	{ tag: "link", key: "href" },
	{ tag: "img", key: "src" },
];

PageTransform.modifyFactory = function(tagKeysPairs=[], modiferFunction, collectorPredicate=PageTransform.urlCollectorPrecicate) {
	return function(urlFactory) {
		return function(current, urls=[]) {
			return async function($) {
				const modifier = modiferFunction(collectorPredicate, urlFactory, current, $);
				const newUrls = await Promise.all(tagKeysPairs.map(modifier));
				const flattened = newUrls.reduce(flatMap, []);
				Array.prototype.push.apply(urls, flattened);
				return $;
			}
		}		
	}
}

PageTransform.collectHyperlinksModifier = function(collectorPredicate, urlFactory, current, $) {
	return async function({ tag, key }) {
		const collection = [];
		const tags = await $(tag);
		tags.each(idx => {
			const orgUrl = tags[idx].attribs[key];
			if (collectorPredicate(orgUrl)) {
				const url = urlFactory(orgUrl);
				collection.push(url);	
			}
		});
		return collection;
	}
}

PageTransform.collectAndTransformHyperlinksModifier = function(collectorPredicate, urlFactory, current, $) {
	return async function({ tag, key }) {
		const collection = [];
		const tags = await $(tag);
		tags.each(idx => {
			const orgUrl = tags[idx].attribs[key];
			if (collectorPredicate(orgUrl)) {
				const url = urlFactory(orgUrl);
				tags[idx].attribs[key] = url.oldUrl.host === url.newUrl.host ? "/" + url.newUrl.route : url.oldUrl.url;
				// tags[idx].attribs[key] = url.oldUrl.url;
				collection.push(url);	
			}
		});
		return collection;
	}	
}


PageTransform.urlCollectorPrecicate = function(e) {
	return typeof e === "string" && 
		e.length > 0 && 
		!/^#/.test(e) && 
		!/^mailto:/.test(e) &&
		!/^http:/.test(e) &&
		!/^https:/.test(e);
};


PageTransform.transformHyperlinks = PageTransform
	.modifyFactory(
		DEFAULT_TAG_KEY_PAIRS, 
		PageTransform.collectAndTransformHyperlinksModifier, 
		PageTransform.urlCollectorPrecicate
	);
PageTransform.collectHyperlinks = PageTransform
	.modifyFactory(
		DEFAULT_TAG_KEY_PAIRS, 
		PageTransform.collectHyperlinksModifier, 
		PageTransform.urlCollectorPrecicate
);


function flatMap(acc, curr) {
	acc.concat(curr)
	return [ ...acc, ...curr];
}

function returnSame(e) {
	return e;
}

function alwaysTrue() {
	return true;
}

function alwaysFalse() {
	return false;
}


module.exports = PageTransform;