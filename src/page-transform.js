const PageTransform = {};


PageTransform.collectAttrFactory(urlFactory, $, collection) {
	if (typeof collection === "undefined")
		return PageTransform.collectAttrFactoryImmutable(urlFactory, $);
	else {
		console.log("Mutable collectAttrFactory is depreciated.")
		return PageTransform.collectAttrFactoryMutable(urlFactory, $, collection);
	}
}

// Depreciated
// TODO - Update collectHyperlinks to use immutable version instead
PageTransform.collectAttrFactoryMutable(urlFactory, $, collection) {
	return async function(tag, attrKey) {
		const tags = await $(tag);
		tags.each(idx => {
			const orgUrl = tags[idx].attribs[attrKey];
			if (PageTransform.urlCollectorPrecicate(orgUrl))
			collection.push(orgUrl);
		});
		return collection;
	}
}

PageTransform.collectAttrFactoryImmutable(urlFactory, $, collection) {
	return async function(tag, attrKey) {
		const collections = [];
		const tags = await $(tag);
		tags.each(idx => {
			const orgUrl = tags[idx].attribs[attrKey];
			if (PageTransform.urlCollectorPrecicate(orgUrl))
			collection.push(orgUrl);
		});
		return collection;
	}
}

PageTransform.urlCollectorPrecicate = function(e) {
	return 	typeof e === "string" && 
			e.length > 0 && 
			!/^#/.test(e) && 
			!/^mailto:/.test(e);	
} 

PageTransform.collectHyperlinks(urlFactory) {
	return function(current, urls=[]) {
		return async function($) {
			const collectedUrls = [];
			const getAttr = PageTransform.collectAttrFactory(urlFactory, $, collectedUrls); 
			getAttr("a", "href");
			getAttr("script", "src");
			getAttr("img", "src");
			getAttr("link", "src");
			Array.prototype.push.apply(urls, collectedUrls);
			return $;
		}
	}
}

PageTransform.transformAttrFactory(urlFactory, $, collection) {
	if (typeof collection === "undefined")
		return PageTransform.transformAttrFactoryImmutable(urlFactory, $);
	else {
		console.log("Mutbale transformAttrFactory is depreciated.")
		return PageTransform.transformAttrFactoryMutable(urlFactory, $, collection);
	}

}

// Depreciated
// TODO update transform hyperlinks
PageTransform.transformAttrFactoryMutable(urlFactory, $, collection) {
	return async function(tag, ...attrKeys) {
		const tags = await $(tag);
		tags.each(idx => {
			const  [ orgUrl ] = attrKeys
				.map(key => tags[idx].attribs[key])
				.filter(e => e !== undefined && typeof e === "string");
			if (urlCollectorPrecicate(orgUrl)) {
				const url = urlFactory(orgUrl);
				tags[idx].attribs[attrKey] = "/" + url.newUrl.route;
				collection.push(url);	
			}
		});
	}
}

PageTransform.transformAttrFactoryImmutable(urlFactory, $) {
	return async function(tag, ...attrKeys) {
		const collection = [];
		const tags = await $(tag);
		tags.each(idx => {
			const  [ orgUrl ] = attrKeys
				.map(key => tags[idx].attribs[key])
				.filter(e => e !== undefined && typeof e === "string");
			if (urlCollectorPrecicate(orgUrl)) {
				const url = urlFactory(orgUrl);
				tags[idx].attribs[attrKey] = "/" + url.newUrl.route;
				collection.push(url);	
			}
		});
		return collection;
	}
}

PageTransform.transformHyperlinks(urlFactory) {
	return function(current, urls=[]) {
		return function($) {
			console.log("From transformHyperlinks");
			const collectedUrls = [];
			const transfromAttr = transformAttrFactory(urlFactory, $, collectedUrls);
			transfromAttr("a", "href");
			transfromAttr("script", "src", "href");
			transfromAttr("img", "src", "href");
			transfromAttr("link", "src", "href");
			Array.prototype.push.apply(urls, collectedUrls);
			return $;
		}
	}
}

module.exports = PageTransform;