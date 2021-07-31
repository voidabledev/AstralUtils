// Packages you will need...
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');
const ms = require('../../functions/ms');
const log = require('../../functions/process-log.js');

module.exports = {
	help: {
		name: 'ban',
		description: 'Bans a user.',
		usage: '[mention or id] [reason]',
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
		let target = message.mentions.members.first();
		if (!target) {
			try {
				target = await message.guild.members.fetch(args[0]);
			}
			catch(e) {
				target = null;
			}
		}
		const id = target?.id ?? args[0];
		args.shift();
		const time = ms(args[0]);
		if (time > 0) args.shift();
		const reason = args.join(' ');
		if (id === message.author.id) {
			return message.channel.send(failureEmbed('You can\'t ban yourself!'));
		}
		const punish = await log({
			guildID: message.guild.id,
			userID: id,
			staffID: message.author.id,
			reason,
			caseType: 'Ban',
			timestamp: new Date().getTime(),
			expires: time > 0 ? Date.now() + time : null,
		}, client);
		if (target) {
			const embed = new MessageEmbed()
				.setAuthor(client.user.username, client.user.avatarURL())
				.setTitle(`You've been banned in ${message.guild.name}`)
				.addField('Reason', reason)
				.addField('Expires', time > 0 ? new Date(Date.now() + time).toLocaleString() : 'Permanent')
				.setFooter(`Punishment ID: ${punish}`);
			try {
				await target.send(embed);
			}
			catch (e) {
				console.error(e);
			}
		}
		message.guild.members
			.ban(id)
			.then(async () => {
				message.channel.send(successEmbed(`<@${id}> has been **banned** |  \`${punish}\`.`));
			}).catch((e) => {
				console.error(e);
				message.channel.send(failureEmbed('I can\'t ban that user!'));
			});
	},
};