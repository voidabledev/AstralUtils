// Packages you will need...
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const ms = require('../../functions/ms');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'ban',
		description: 'Bans a user',
		usage: '[user mention or ID] (time) [reason]',
		aliases: alias.staff.ban,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['BAN_MEMBERS'],
		botPerms: ['BAN_MEMBERS'],
		requiredRoles: [],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		let target = message.mentions.users.first();
		if (!target) target = await client.users.fetch(args[0]);
		const time = ms(args[1]);
		if (time > 0) args.shift();
		const reason = `\`${args.slice(1).join(' ')}\``;
		if (!target) {
			return message.channel.send(
				failureEmbed('Please specify someone to ban.'),
			);
		}
		const id = target.id;
		if (id === message.author.id) {
			return message.channel.send(failureEmbed('You can\'t ban yourself!'));
		}
		const embed = new MessageEmbed()
			.setDescription(
				`You have been banned from **${message.guild.name}** for ${reason}. If you think this was a mistake, you can appeal [here](https://forms.gle/SUynmsZQzWwjxwVn7)`,
			)
			.setColor('RED');
		try {
			await target.send(embed);
		}
		catch (e) {
			console.error(e);
		}
		message.guild.members
			.ban(id)
			.then(() =>
				message.channel.send(successEmbed(`${target} has been banned.`)),
			)
			.catch(() => {
				message.channel.send(failureEmbed('I can\'t ban that user!', 'oh no'));
			});
	},
};
