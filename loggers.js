const { performance } = require('perf_hooks');

function log(msg, level) {

	let levels = {
		error: '❌| ',
		warn: '⚠️ | ',
		success: '✅| ',
		info: 'ℹ️ | ',
		debug: '🐛| '
	};
	console.log(`${levels[level]} ${msg}`);
}

function profile(start) {
	let diff = performance.now() - start;
	if (diff < 500) {
		log('Done in: ' + (((performance.now() - start)).toFixed(2)) + 'ms.', 'success');
		return 'Done in: ' + (((performance.now() - start)).toFixed(2)) + 'ms.';
	} else {
		log('Done in: ' + (((performance.now() - start) / 1000).toFixed(2)) + 's.', 'success');
		return 'Done in: ' + (((performance.now() - start) / 1000).toFixed(2)) + 's.';
	}
	
}

module.exports = {
	log,
	profile
};