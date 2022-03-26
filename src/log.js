const fse = require("fs-extra");

const Log = {};

Log.logFactory = function(url, rootDirectory="") {
	const startAt = Date.now();
	return function toLog(completedSet, failureSet) {
		const completed = [];
		completedSet.forEach(url => completed.push(url));
		const failure = [];
		failureSet.forEach(url => failure.push(url));
		
		const log = {
			failure,
			completed,
			url,
			startAt,
			finishAt: Date.now()
		};

		fse.writeJsonSync(rootDirectory + '/log.json', log);

	}
}

module.exports = Log;