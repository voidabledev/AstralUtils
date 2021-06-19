/**
 * Sets a new random status for the client user.
 * @param {Object} client The discord.js client.
 * @returns {void} Nothing.
 */
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
		['everyone', 'WATCHING', 'online'],
	];
	const index = Math.floor(Math.random() * rand.length);
	client.user.setPresence({
		status: rand[index][2],
		activity: {
			name: `${rand[index][0]}`,
			type: rand[index][1],
		},
	});
}

module.exports = statuses;