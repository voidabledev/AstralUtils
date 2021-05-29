/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const log = require('../../functions/process-log');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'kick',
		description: 'The most useless moderation command in existance. Seriously, I don\'t know why you would use this.',
		usage: '[user mention or ID] [reason]',
		aliases: alias.staff.kick,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['KICK_MEMBERS'],
		botPerms: ['KICK_MEMBERS'],
		requiredRoles: [],
		delete: true,
	},
	async execute(message, args, client) {
		const target = message.mentions.users.first() || await message.guild.members.cache.get(args[0]);
		const reason = args.slice(1).join(' ');
		if(!target) {
			return message.channel.send(failureEmbed('Please provide a valid user mention or ID', 'Seriously, why don\'t you just ban them?'));
		}
		const targetMember = await message.guild.members.fetch(target.id);
		if (!targetMember.manageable || targetMember.id === message.author.id) {
			return message.channel.send(
				failureEmbed('I can\'t kick that user!', 'too strong'),
			);
		}
		const punish = await log({
			guildID: message.guild.id,
			userID: target.id,
			staffID: message.author.id,
			reason,
			caseType: 'Kick',
			timestamp: new Date().getTime(),
		}, client);
		const embed = new MessageEmbed()
			.setDescription(`You have been kicked from **${message.guild.name}** for \`${reason}\``)
			.setFooter(`Punishment ID: ${punish}`)
			.setColor('RED');
		await target.send(embed);
		targetMember.kick();
		message.channel.send(
			successEmbed(`${target} was kicked for \`${reason}\` with ID \`${punish}\``, 'y tho?'),
		);
	},
};