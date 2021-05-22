// eslint-disable indent-space
const alias = require('../../json/aliases.json');
const failureEmbed = require('../../utils/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'strike',
	description: 'Strikes a staff member',
	aliases: ['s'] || alias.admin.strike,
	cooldown: 5,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		let target;
		try {
			target =
        message.mentions.users.first() || (await client.users.fetch(args[0]));
		}
		catch (e) {
			return message.channel.send(
				failureEmbed('You have to specify someone to strike!', 'lol'),
			);
		}
		if (!target) {
			return message.channel.send(
				failureEmbed('You have to specify someone to strike!', 'ok'),
			);
		}
		const reason = `\`${args.slice(1).join(' ')}\``;
		if (reason.length < 5) {
			return message.channel.send(
				failureEmbed(
					'You have to specify a reason! You can\'t strike without a reason.',
				),
			);
		}
		const { id } = target;
		if (id === message.author.id) {
			return message.channel.send(
				failureEmbed(
					'Failure!',
					'You\'re a silly Admin you know? You can\'t strike yourself.',
				),
			);
		}
		const targetMember = await message.guild.members.fetch(id);
		if (
			message.member.roles.highest.position <
      targetMember.roles.highest.position
		) {
			return message.channel.send(
				failureEmbed(
					'Who are you trying to strike, the owner? You can\'t strike people above you!',
				),
			);
		}
		const strikeId = require('../../utils/id');
		const embed = new MessageEmbed()
			.setTitle('Striked')
			.setDescription(
				`You have been striked by ${message.author} for ${reason} with ID \`${strikeId}\``,
			)
			.setFooter(
				'If you think this is a mistake, please DM the Admin who striked you',
			);
		target.send(embed);
		const logEmbed = new MessageEmbed()
			.setTitle('Striked')
			.setDescription(
				`${target} has been striked by ${message.author} for ${reason} with ID \`${strikeId}\``,
			)
			.setFooter(`User ID: ${id}`);
		const messageEmbed = new MessageEmbed()
			.setTitle('Strike')
			.setDescription(
				`You have striked ${target} for \`${reason}\` and with ID \`${strikeId}\``,
			);
		message.channel.send(messageEmbed);
		message.guild.channels.cache.get('831996554763829338').send(logEmbed);
	},
};
