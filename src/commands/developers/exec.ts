/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { devs } from '../../config.json';
import { MessageEmbed, FileOptions } from 'discord.js';
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
		const files: FileOptions[] = [];
		await interaction.deferReply({ ephemeral });
		const embed = new MessageEmbed()
			.setTitle('Shell Execution')
			.addField('Input', '```sh\n' + code + '\n```')
			.setFooter('Status: Success')
			.setColor('ORANGE');
		exec(code, async (err, stdout, stderr) => {
			if (stdout.length) {
				embed
					.addField(
						'Output',
						stdout.length < 1000 ? '```\n' + stdout + '\n```' : 'View to attachment to see the output.',
					)
					.setColor('GREEN');
				if (stdout.length >= 1000) files.push({ name: 'output.txt', attachment: Buffer.from(stdout) });
			}
			if (stderr.length) {
				embed
					.addField(
						'Error',
						stderr.length < 1000 ? '```\n' + stderr + '\n```' : 'View to attachment to see the error.',
					)
					.setFooter('Status: Failed')
					.setColor('RED');
				if (stderr.length >= 1000) files.push({ name: 'output.txt', attachment: Buffer.from(stderr) });
			}
			interaction.followUp({ embeds: [embed], files });
		});
	},
};
