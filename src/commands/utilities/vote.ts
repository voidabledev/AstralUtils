/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
	name: 'vote',
	description: 'Get a link to this server\'s voting page.',
	async run(interaction, options, client) {
		const embed = new MessageEmbed()
			.setTitle(`Vote for ${interaction.guild?.name}`)
			.setDescription(`> Vote for **${interaction.guild?.name}** [here](https://top.gg/servers/831995980097388604/vote)`);
		await interaction.reply({
			embeds: [embed],
		});
	},
};
