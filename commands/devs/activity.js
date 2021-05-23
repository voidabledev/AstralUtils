const alias = require('../../json/aliases.json');
const successEmbed = require('./functions/success-embed');
const failureEmbed = require('./functions/failure-embed');
const statuses = require('../../functions/statuses');
const validTypes = [
	'PLAYING',
	'STREAMING',
	'LISTENING',
	'WATCHING',
	'COMPETING',
];

module.exports = {
	name: 'activity',
	description: 'Changes the activity of the bot.',
	aliases: ['act'] || alias.devs.activity,
	cooldown: 15,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		if (!client.conf.devs.includes(message.author.id)) {
			return message.channel.send(
				failureEmbed(
					'You don\'t have permission to use this command!',
					'this is for devs',
				),
			);
		}
		if (args[0].toLowerCase() === 'random') {
			statuses(client);
			return message.channel.send(
				successEmbed('I chose a new random activity!'),
			);
		}
		const type = args.shift().toUpperCase();
		if (!validTypes.includes(type)) {
			return message.channel.send(
				failureEmbed(
					`You didn't provide a valid activity type. Choose on of the following (case insensitive):\n${validTypes.join(
						',\n',
					)}`,
					'or just use "random" for a predfined set of activities',
				),
			);
		}
		client.user.setPresence({ activity: { name: args.join(' '), type } });
		return message.channel.send(
			successEmbed('My activity has been set!'),
		);
	},
};
