const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config');
const bundler = require('./bundler');
const { performance } = require('perf_hooks');
const l = require('./loggers');
var finalBundle = 0;
var start;

client.on('ready', () => {
	l.log(`Logged in as ${client.user.tag}!`, 'info');

	start = performance.now();
	var bundles = bundler.bundle();
	finalBundle = bundles.length - 1;
	const channel = client.channels.cache.get(config.channel);

	bundles.forEach((bundle, i) => {
		let files = [];
		bundle.files.forEach(file => {
			files.push(file.path); 
		});

		channel.send(i, {
			files: files
		})
			.then(() => {
				l.log(`Queued bundle ${i + 2} of ${bundles.length - 1}`, 'info');
			})
			.catch(err => {
				l.log(`Something failed with bundle ${i + 1} (index ${i}!)`, 'warn');
				l.log(err, 'debug');
				l.log('The following file(s) were not sent:', 'debug');
				files.forEach(failure => { l.log(failure, 'error'); });

			});
	});

	l.log('Processing done, beginning upload.', 'success');
	l.log('KEEP THE SESSION OPEN UNTIL ALL IMAGES HAVE BEEN SUCCESSFULLY UPLOADED!', 'warn');
});


client.on('message', msg => {
	if (msg.author.id == client.user.id) {
		l.log(`Uploaded ${Number(msg.content) + 1} of ${finalBundle}`, 'success');
		if (msg.content == finalBundle) {
			l.log('Finished uploading.', 'success');
			msg.channel.send(l.profile(start));
			setTimeout(() => {
				process.exit(0);
			}, 5000);

		}
	} 
});




client.login(config.token);