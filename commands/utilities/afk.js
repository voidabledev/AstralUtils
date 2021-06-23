/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');
const afkSchema = require('../../models/afkschema');

module.exports = {
	help: {
		name: 'afk',
		description: 'AFKs the user',
		usage: '[reason]',
		aliases: alias.utilities.afk,
		category: 'utilities',
		cooldown: 5,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: ['MANAGE_MESSAGES', 'MANAGE_NICKNAMES'],
		requiredRoles: [],
		delete: true,
	},
	async execute(message, args, client) {
		let afkMessage = args.join(' ');
		const userId = message.author.id;
		const guildId = message.guild.id;

		const embed = new MessageEmbed();
		if (!afkMessage) {
			afkMessage = 'AFK';
		}
		await afkSchema.findOneAndUpdate({
			guildId,
			userId,
		}, {
			guildId,
			userId,
			$set: {
				afk: afkMessage,
				timestamp: new Date().getTime(),
				username: message.member.nickname === null ? message.author.username : message.member.nickname,
			},
		}, {
			upsert: true,
		});

		await message.member.setNickname(`[AFK] ${message.member.nickname === null ? `${message.author.username}` : `${message.member.nickname}`}`).catch((e) => {
			console.log('No Permissions.');
		});

		return message.channel.send(embed
			.setColor(message.guild.me.displayColor)
			.setAuthor('Your AFK Message Has Been Set', message.author.displayAvatarURL())
			.setDescription(`\`${afkMessage}\``)
			.setTimestamp());
	},
};