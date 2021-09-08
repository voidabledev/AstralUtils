/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { readdirSync } from 'fs';
import { MessageEmbed, EmbedFieldData } from 'discord.js';

export const command: Command = {
	name: 'help',
	description: 'View a list of commands.',
	category: 'Utilities',
	async run(interaction, options, client) {
		const fields: Array<EmbedFieldData> = [...client.categories].map(
			(value: string) => {
				return {
					name: `${value[0].toUpperCase() + value.slice(1).toLowerCase()} [${
						client.commands.filter(
							(cmd: Command) =>
								cmd.category.toLowerCase() == value.toLowerCase(),
						).size
					}]`,
					value: client.commands
						.filter(
							(cmd: Command) => cmd.category.toLowerCase() == value.toLowerCase(),
						)
						.map((cmd: Command) => `\`${cmd.name}\``)
						.join(', '),
				};
			},
		);
		const embed = new MessageEmbed()
			.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
			.setDescription('Type `/` followed by the command name to view information and options on a specific command, or to use it. You may not have permissions to use some commands.')
			.setFooter('imagine not memorizing commands')
			.addFields(fields)
			.setTimestamp()
			.setColor('RANDOM');
		interaction.reply({
			embeds: [embed],
		});
	},
};
