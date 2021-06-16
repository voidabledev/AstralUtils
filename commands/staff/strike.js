// eslint-disable indent-space
const alias = require('../../json/aliases.json');
const failureEmbed = require('../../functions/failure-embed');
const strikes = require('../../models/strikeschema');
const id = require('../../functions/id');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'strike',
		description: 'Strikes a staff member',
		usage: '[mention or id] [reason]',
		aliases: alias.admin.strike,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['836583124283686943', '831996396684050443', '831996396151636029'],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		let target;
		try {
			target = message.mentions.users.first() || (await client.users.fetch(args[0]));
		}
		catch (e) {
			return message.channel.send(
				failureEmbed('You have to specify someone to strike!'),
			);
		}
		const reason = `\`${args.slice(1).join(' ')}\``;
		if (reason.length < 5) {
			return message.channel.send(failureEmbed('You have to specify a reason! You can\'t strike without a reason.'));
		}
		if (target.id === message.author.id) {
			return message.channel.send(failureEmbed('You can\'t strike yourself.'));
		}
		const targetMember = await message.guild.members.fetch(target.id);
		if (message.member.roles.highest.position < targetMember.roles.highest.position) {
			return message.channel.send(failureEmbed('Who are you trying to strike, the owner? You can\'t strike people above you!'));
		}
		if (targetMember.roles.cache.get('836583124283686943') || targetMember.roles.cache.get('831996396684050443') || targetMember.roles.cache.get('718813416407564340')) {
			return message.channel.send(failureEmbed('You can\'t strike a Manager or above.'));
		}
		const strikeID = id(36, 8);
		let messaged = '';
		const embed = new MessageEmbed()
			.setTitle('Striked')
			.setDescription(`You have been striked by ${message.author} for ${reason} with ID \`${strikeID}\``)
			.setFooter('If you think this is a mistake, please appeal with a Manager.');
		target.send(embed)
			.catch(() => (messaged = 'I was unable to DM this user.'));
		const logEmbed = new MessageEmbed()
			.setTitle('New Strike')
			.setDescription(`${target} has been **striked** by ${message.author} for ${reason} | \`${strikeID}\`.`)
			.setFooter(`User ID: ${target.id}`);
		const messageEmbed = new MessageEmbed()
			.setTitle('Strike')
			.setDescription(`${target} has been **striked** | \`${strikeID}\`. ${messaged}`);
		message.channel.send(messageEmbed);
		message.guild.channels.cache.get('831996554763829338')
			.send(logEmbed)
			.then(async (m) => {
				await strikes.create({
					userID: target.id,
					strikeID,
					messageID: m.id,
				});
			});
	},
};
