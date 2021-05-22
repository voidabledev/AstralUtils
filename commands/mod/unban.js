// Packages you will need...
const alias = require('../../json/aliases.json');
const successEmbed = require('../../utils/success-embed');
const failureEmbed = require('../../utils/failure-embed');
const errorEmbed = require('../../utils/error-embed');

module.exports = {
	name: 'unban',
	description: 'Unbans a user.',
	aliases: ['ub'] || alias.mod.unban,
	cooldown: 5,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const guild = message.guild;
		const search = args[0];

		if (!search) {
			return message.channel.send(
				failureEmbed('Please provide a valid user ID'),
			);
		}

		try {
			const bans = await message.guild.fetchBans();
			const banned = await bans.find((b) => b.user.id === search);

			if (!banned) {return message.channel.send(failureEmbed('The user is not banned.'));}

			await guild.members.unban(banned.user);

			message.channel.send(successEmbed(`${banned.user} has been unbanned.`));
		}
		catch (e) {
			return message.channel.send(errorEmbed);
		}
	},
};
