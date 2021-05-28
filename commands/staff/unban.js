// Packages you will need...
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const errorEmbed = require('../../functions/error-embed');
const log = require('../../functions/process-log.js');

module.exports = {
	help: {
		name: 'unban',
		description: 'Unbans a user',
		usage: '[user ID] [reason]',
		aliases: alias.staff.unban,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['BAN_MEMBERS'],
		botPerms: ['BAN_MEMBERS'],
		requiredRoles: [],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const guild = message.guild;
		try {
			const bans = await message.guild.fetchBans();
			const banned = await bans.find((b) => b.user.id === args.shift());
			const reason = args.join(' ') || 'No reason specified';

			if (!banned) {return message.channel.send(failureEmbed('This user is not banned.'));}

			await guild.members.unban(banned.user);

			message.channel.send(successEmbed(`${banned.user} has been unbanned.`));

			log({
				guildID: message.guild.id,
				userID: banned.user.id,
				staffID: message.author.id,
				reason,
				caseType: 'Unban',
				timestamp: new Date().getTime(),
			}, client);
		}
		catch (e) {
			return message.channel.send(errorEmbed);
		}
	},
};
