const fs = require('fs');
const config = require('./config');
const l = require('./loggers');
const { performance } = require('perf_hooks');
/*
	bundle returns an array with the following schema:
	[
		{
			bundleNo = 0,
			size: total size in MB,
			files: [{ path: 'path/to/file.png', size: 420 }],
		},
	]
*/


function bundle() {
	let start = performance.now();
	/*
		The file limit per message is 8MB
		Iterate through the files, and put them into bundles
		that do not exceed 8MB total.
      Lazy bundler, only will try and bundle files that are adjacent.
      There is a limit of 10 attatchments per message.
	*/
	var bundles = [
		{
			bundleNo: 0,
			size: 0,
			files: []
		}
	];
	let currentBundleSize = 0;
	let currentBundleIndex = 0;

	let files = fs.readdirSync(config.pathToDump);
	files.forEach((el) => {
		let file = {
			path: config.pathToDump + el,
			size: fs.statSync(config.pathToDump + el).size
		};
		if (file.size > config.maxBundleSize) {
			// Case 0: The file is above the max bundle size. Exit with non-zero.
			l.log('Bundling failed! The following file is too large!', 'error');
			l.log(file.path, 'error');
			l.log((file.size / 1000000).toFixed(2) + 'MB', 'error');
			process.exit(1);
		} else if ((file.size + currentBundleSize < config.maxBundleSize) && ((bundles[currentBundleIndex].files.length - 1) < 9)) {
			// Case 1: The file is small enough to be added to the current bundle. We add to this bundle.
			currentBundleSize += file.size;
			bundles[currentBundleIndex].files.push(file);
		} else {
			// Case 2: The file is too big to fit in the current bundle, or max number of images reached. We create a new bundle.
			currentBundleIndex++;
			currentBundleSize = 0 + file.size;
			bundles.push({
				bundleNo: currentBundleIndex,
				size: 0 + file.size,
				files: [file]
			});
		}
		
	});
	l.log('Bundling complete!', 'info');
	l.profile(start);
	return bundles;
}

module.exports = {
	bundle
};