async function statuses(client) {
	const rand = [
		['with the universe', 'PLAYING', 'online'],
		['with the stars', 'PLAYING', 'idle'],
		['with your computer', 'PLAYING', 'dnd'],
		['Minecraft', 'PLAYING', 'dnd'],
		['in the galaxy', 'PLAYING', 'online'],
		['with your feelings', 'PLAYING', 'idle'],
		['you', 'WATCHING', 'online'],
		['space', 'COMPETING', 'dnd'],
		['the sound of silence', 'LISTENING', 'idle'],
		['over the galaxy', 'WATCHING', 'online'],
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
		// AH TU LO DEL PACKAGE NO SE ME OCURRIÓ EN LA VIDA
		activity: {
			name: `${rand[index][0]} | >help | v${
				require('../package.json').version
			}`,
			type: rand[index][1],
		},
	});
}

module.exports = statuses;
// La hostia