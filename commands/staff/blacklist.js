/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const bl = require('../../models/blacklistschema');
const log = require('../../functions/process-log');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'blacklist',
		description: 'Blocks a member from using the bot',
		usage: '[reason]',
		aliases: alias.staff.blacklist,
		category: 'staff',
		cooldown: 30,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996400782016563'],
		delete: true,
	},
	async execute(message, args, client) {
		const target =
    message.mentions.users.first() || client.users.cache.get(args[0]);
		if (!target) {
			return message.channel.send(
				failureEmbed('Please specify someone to blacklist!'),
			);
		}
		args.shift();
		const reason = args.join(' ');
		const { id } = target;
		if (await bl.findOne({ userID: target.id })) {
			return message.channel.send(
				failureEmbed('This user is already blacklisted!'),
			);
		}
		if (client.conf.devs.includes(id) || message.author.id === id) {
			return message.channel.send(
				failureEmbed(
					'You can\'t blacklist that person!',
				),
			);
		}
		const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
		const punish = await log({
			guildID: message.guild.id,
			userID: target.id,
			staffID: message.author.id,
			reason,
			caseType: 'Blacklist',
			timestamp: new Date().getTime(),
			expires: expires,
		}, client);
		await bl.create({
			userID: target.id,
			reason,
		});
		let successMessage = `<@${id}> has been blacklisted for ${reason} with ID ${punish}!`;
		const embed = new MessageEmbed()
			.setAuthor(client.user, client.displayAvatarURL())
			.setTitle(`You've been blacklisted in ${message.guild.name}`)
			.addField('Reason', reason)
			.addField('Expires', expires)
			.setFooter(`Punishment ID: ${punish}`);
		try {
			await target.send(embed);
		}
		catch (e) {
			successMessage += 'I was unable to DM them.';
		}
		message.channel.send(
			successEmbed(successMessage),
		);
	},
};
