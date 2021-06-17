/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const log = require('../../functions/process-log');
const punishSchema = require('../../models/punishschema');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'unmute',
		description: 'Unmutes a muted user.',
		usage: '[mention or id] [reason]',
		aliases: alias.staff.unmute,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: ['MANAGE_ROLES'],
		requiredRoles: [],
		delete: true,
	},
	async execute(message, args, client) {
		const member = message.mentions.members.first() || (await message.guild.members.fetch(args[0]));
		const role = message.guild.roles.cache.find((r) => r.name.toLowerCase() === 'muted');
		const reason = args.slice(1).join(' ');
		if (!member) message.channel.send(failureEmbed('You need to provide a user.'));
		if (!member.roles.cache.get(role.id)) message.channel.send(failureEmbed('The user\'s not muted.'));
		member.roles.remove(role)
			.then(async () => {
				const punish = await log({
					guildID: message.guild.id,
					userID: member.user.id,
					staffID: message.author.id,
					reason,
					caseType: 'Unmute',
					timestamp: new Date().getTime(),
				}, client);
				let success = `${member.user} has been **unmuted** | \`${punish}\`. `;
				try {
					const embed = new MessageEmbed()
						.setAuthor(client.user.username, client.displayAvatarURL())
						.setTitle(`You've been unmuted in ${message.guild.name}`)
						.addField('Reason', reason)
						.setFooter(`Punishment ID: ${punish}`);
					member.user.send(embed);
				}
				catch (err) {
					success += 'I was unable to DM this user.';
				}
				message.channel.send(successEmbed(success));
				await punishSchema.findOneAndUpdate({
					caseType: 'Mute',
					userID: member.id,
					isActive: true,
				}, {
					isActive: false,
					expires: Date.now(),
				});
			});
	},
};