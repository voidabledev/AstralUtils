/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
	name: 'ping',
	description: 'Gets the bot\'s ping.',
	async run(interaction, options, client) {
		await interaction.reply({
			embeds: [new MessageEmbed().setDescription(`🏓 Pong! ${client.ws.ping}ms.`).setColor('GREEN')],
		});
	},
};
