import { Command } from '../typings/command';
import { devs } from '../config.json';
import { MessageEmbed } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { exec } from 'child_process';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const command: Command = {
	name: 'exec',
	description: 'Executes shell code [Developers only]',
	options: [
		{
			type: Options.String,
			name: 'code',
			description: 'The code to execute.',
			required: true,
		},
		{
			type: Options.Boolean,
			name: 'ephemeral',
			description: '"Only you can see this."',
		},
	],
	async allowed(interaction, client) {
		return devs.includes(interaction.user.id);
	},
	async run(interaction, options, client) {
		const ephemeral = options.getBoolean('ephemeral') ?? true;
		const code = options.getString('code', true);

		await interaction.deferReply({ ephemeral });

		const embed = new MessageEmbed()
			.setTitle('Shell Execution')
			.addField('Input', '```sh\n' + code + '\n```')
			.setFooter('Status: Success')
			.setColor('ORANGE');

		exec(code, async (err, stdout, stderr) => {
			if (stdout.length) {
				embed
					.addField('Output', '```\n' + stdout.slice(0, 1000) + (stdout.length > 1000 ? '...' : '') + '\n```')
					.setColor('GREEN');
			}

			if (stderr.length) {
				embed
					.addField('Error', '```\n' + stderr.slice(0, 1000) + (stderr.length > 1000 ? '...' : '') + '\n```')
					.setFooter('Status: Failed')
					.setColor('RED');
			}
			interaction.followUp({ embeds: [embed] });
		});
	},
};
