import { Command } from '../Typings/Command';
import { devs } from '../config.json';
import { MessageEmbed } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const command: Command = {
	name: 'eval',
	description: 'Executes code [Developers only]',
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
			.setTitle('Eval result')
			.addField('Input', '```js\n' + code + '\n```');

		try {
			const result = await eval(code);

			embed
				.addField('Output', '```js\n' + result + '\n```')
				.setFooter('Status: Success')
				.setColor('GREEN');
		}
		catch (e) {
			embed
				.addField('Error', '```js\n' + e.message + '\n```')
				.setFooter('Status: Failed')
				.setColor('RED');
		}
		await interaction.followUp({
			embeds: [embed],
			ephemeral,
		});
	},
};
