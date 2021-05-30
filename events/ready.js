const statuses = require('../functions/statuses');
module.exports = {
	name: 'ready',
	once: false,
	execute: (client) => {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		require('../functions/interval')(client);
		require('../functions/giveaway-setup')(client);
		statuses(client);
		client.setInterval(() => {
			statuses(client);
		}, 300000);
	},
};
