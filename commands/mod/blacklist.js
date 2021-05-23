/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('./functions/success-embed');
const failureEmbed = require('./functions/failure-embed');
const blSchema = require('../../models/punishschema');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'blacklist',
	description: 'Blocks a member from using the bot',
	aliases: ['bl', 'block'] || alias.mod.blacklist,
	cooldown: 30,
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
		if (await client.blacklisted(id)) {
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
		await blSchema.create({
			userId: id,
			reason,
			caseType: 'Blacklist',
		});

		message.channel.send(
			successEmbed(
				`<@${id}> has been blacklisted for ${reason}!`,
			),
		);
		const embed = new MessageEmbed()
			.setTitle('Bot blacklist')
			.setDescription(`You have been blacklisted from using ${client.user.username} for \`${reason}\`. This means that you can no longer use any commands of this bot, and that you can no longer take part in giveaways. If you think this was a mistake, please DM <@804074816704348182>.`)
			.target
			.send(embed)
			.catch((e) => message.channel.send('I was unable to notify the user.'));
	},
};
