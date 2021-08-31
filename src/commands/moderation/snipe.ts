/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Permissions, MessageEmbed } from 'discord.js';
import { fail } from '../../modules/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'snipe',
	description: 'Displays the last deleted or edited message in the channel.',
	options: [
		{
			type: Options.Subcommand,
			name: 'deleted',
			description: 'Displays the last deleted message in the channel.',
		},
		{
			type: Options.Subcommand,
			name: 'edited',
			description: 'Displays the last edited message in the channel.',
		},
	],
	async allowed(interaction, client) {
    		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'MANAGE_MESSAGES',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const subcommand = options.getSubcommand(true);

		if (subcommand === 'deleted') {
			const msg = client.snipes.deleted.get(interaction.channel.id);
			if (!msg) {
				return interaction.reply({
					embeds: [fail('I couldn\'t find any message deleted.')],
				});
			}
			const embed = new MessageEmbed()
				.setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
				.setDescription(msg.content)
				.setColor('RANDOM')
				.setFooter(`User ID: ${msg.author.id} | Message ID: ${msg.id}`)
				.setTimestamp();
			if (msg.attachments.first()) {
				embed.setImage(msg.attachments.first().proxyURL);
			}
			interaction.reply({
				embeds: [embed],
			});
		}

		if (subcommand === 'edited') {
			const msgs = client.snipes.edited.get(interaction.channel.id);
			if (!msgs) {
				return interaction.reply({
					embeds: [fail('I couldn\'t find any message edited.')],
				});
			}
			const [oldMsg, newMsg] = msgs;
			const embed = new MessageEmbed()
				.setAuthor(newMsg.author.tag, newMsg.author.displayAvatarURL({ dynamic: true }))
				.addFields(
					{ name: 'Old message content', value: oldMsg.content || '`No content found.`' },
					{ name: 'New message content', value: newMsg.content || '`No content found.`' },
				)
				.setFooter(`User ID: ${newMsg.author.id} | Message ID: ${newMsg.id}`)
				.setTimestamp(newMsg.editedTimestamp)
				.setColor('RANDOM');
			await interaction.reply({
				embeds: [embed],
			});
		}
	},
};