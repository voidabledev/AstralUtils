const conf = require('../json/configuration.json');
async function statuses(client) {
	const rand = [
		['with code', 'PLAYING', 'online'],
		['the developers yelling at me', 'WATCHING', 'idle'],
		['with your computer', 'PLAYING', 'dnd'],
		['Minecraft', 'PLAYING', 'dnd'],
		['with the other bots', 'PLAYING', 'online'],
		['with your feelings', 'PLAYING', 'idle'],
		['you', 'WATCHING', 'online'],
		['Simon Says', 'COMPETING', 'dnd'],
		['my fav songs', 'LISTENING', 'idle'],
		['over the island', 'WATCHING', 'online'],
		['the sky', 'WATCHING', 'dnd'],
		['with code', 'PLAYING', 'idle'],
		['you like a fiddle', 'PLAYING', 'online'],
		['alone', 'PLAYING', 'dnd'],
		['dead', 'PLAYING', 'idle'],
		['Discord', 'PLAYING', 'online'],
		['the sky', 'WATCHING', 'dnd'],
		['with fire', 'PLAYING', 'idle'],
	];
	const index = Math.floor(Math.random() * rand.length);
	client.user.setPresence({
		status: rand[index][2],
		activity: {
			name: `${rand[index][0]} | ${process.argv.length > 2 ? conf.betaPrefix : conf.prefix}help | v${
				require('../package.json').version
			}`,
			type: rand[index][1],
		},
	});
}

module.exports = statuses;
// La hostia