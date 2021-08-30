/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Permissions, MessageEmbed } from 'discord.js';
import { fail } from '../../modules/embeds';

export const command: Command = {
	name: 'snipe',
	description: 'Displays the last deleted message in the channel.',
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
		const msg = client.snipes.get(interaction.channel.id);
		if (!msg) {
			return interaction.reply({
				embeds: [fail('I couldn\'t find any message deleted.')],
			});
		}
		const embed = new MessageEmbed()
			.setAuthor(msg.author)
			.setDescription(msg.content)
			.setColor('RANDOM')
			.setTimestamp();
		if (msg.image) {
			embed.setImage(msg.image);
		}
		interaction.reply({
			embeds: [embed],
		});
	},
};