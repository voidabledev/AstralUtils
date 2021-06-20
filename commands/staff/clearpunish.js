/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const punish = require('../../models/punishschema');

module.exports = {
	help: {
		name: 'clearpunish',
		description: 'Deletes all punishments of a user.',
		usage: '[User mention or ID] [reason]',
		aliases: alias.staff.clearpunish,
		category: 'staff',
		cooldown: 120,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['ADMINISTRATOR'],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const userID = message.mentions.users.first() ?
			message.mentions.users.first().id :
			args[0];
		const reason = args.slice(1).join(' ');
		const logChannel = message.guild.channels.cache.get('851883465364078632');
		let amount;
		try {
			await punish.find({ userID }, (err, logs) => {
				amount = logs.length;
				if (!amount) throw new Error(`I couldn't find any punishments for <@${userID}>!`);
				logs.forEach(async (log) => {
					punish.deleteOne(log);
				});
			});
			message.channel.send(successEmbed(`Deleted \`${amount}\` punishments for <@${userID}>!`));
			const logEmbed = new MessageEmbed()
				.setTitle('Punishments Removed')
				.addField('Removed For', reason)
				.addField('Removed amount', amount)
				.addField('User', `<@${userID}> (${userID})`)
				.setColor('RANDOM')
				.setFooter(`Deleted by: ${message.author.tag} (${message.author.id})`);
			const webhooks = await logChannel.fetchWebhooks();
			const webhook = webhooks.size ? webhooks.first() : await logChannel.createWebhook(client.user.username, {
				avatar: client.user.avatarURL(),
			});
			webhook.send({
				username: client.user.username,
				avatarURL: client.user.avatarURL(),
				embeds: [logEmbed],
			});
		}
		catch (err) {
			message.channel.send(failureEmbed(err.message));
		}
	},
};