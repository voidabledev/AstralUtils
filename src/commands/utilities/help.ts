/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { readdirSync } from 'fs';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
	name: 'help',
	description: 'View a list of commands.',
	async run(interaction, options, client) {
		const embed = new MessageEmbed()
			.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
			.setDescription('Type `/` followed by the command name to view information and options on a specific command, or to use it. You may not have permissions to use some commands.')
			.setFooter('imagine not memorizing commands')
			.setTimestamp()
			.setColor('RANDOM')
			.addFields(
				readdirSync(`${__dirname}/..`).map((c) => {
					return {
						name: `${c.charAt(0).toUpperCase()}${c.slice(1)}`,
						value: '`' + readdirSync(`${__dirname}/../${c}`).map((f) => f.split('.')[0]).join(', ') + '`',
					};
				}),
			);
		interaction.reply({
			embeds: [embed],
		});
	},
};
