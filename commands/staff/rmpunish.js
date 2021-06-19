// Packages you will need...
const alias = require('../../json/aliases.json');
const punish = require('../../models/punishschema');
const fail = require('../../functions/failure-embed');
const succ = require('../../functions/success-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'rmpunish',
		description: 'Removes a punishment.',
		usage: '[punishment id] [reason]',
		aliases: alias.staff.rmpunish,
		category: 'staff',
		cooldown: 15,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996400782016563', '831996399209414697', '836583124283686943', '831996396684050443', '831996396151636029'],
		delete: false,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const data = await punish.findOneAndDelete({ punishID: args[0] });
		const logChannel = message.guild.channels.cache.get('851883465364078632');
		if (!data) return message.channel.send(fail('I couldn\'t find a punishment with this ID.'));
		args.shift();
		const reason = args.join(' ');
		if (!reason) {
			return message.channel.send(fail('You didn\'t provide a valid reason.'));
		}
		const embed = succ(`Deleted the punishment with ID \`${data.punishID}\` for \`${reason}\`.`)
			.addField('Type', data.caseType)
			.addField('Moderator', `<@${data.staffID}> (${data.staffID})`)
			.addField('User', `<@${data.userID}> (${data.userID})`)
			.addField('Reason', data.reason);
		message.channel.send(embed);
		const logEmbed = new MessageEmbed()
			.setTitle('Punishment Removed')
			.addField('Removed For', reason)
			.addField('Type', data.caseType)
			.addField('Moderator', `<@${data.staffID}> (${data.staffID})`)
			.addField('User', `<@${data.userID}> (${data.userID})`)
			.addField('Reason', data.reason)
			.setColor('RANDOM')
			.setFooter(`Deleted by: ${message.author.tag}`);
		const webhooks = await logChannel.fetchWebhooks();
		const webhook = webhooks.size ? webhooks.first() : await logChannel.createWebhook(client.user.username, {
			avatar: client.user.avatarURL(),
		});
		webhook.send({
			username: client.user.username,
			avatarURL: client.user.avatarURL(),
			embeds: [logEmbed],
		});
	},
};
