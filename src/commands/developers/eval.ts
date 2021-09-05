/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { devs } from '../../config.json';
import { MessageEmbed, FileOptions } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { transpileModule, ScriptTarget } from 'typescript';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

export const command: Command = {
	name: 'eval',
	description: 'Evaluates TS code [Developers only]',
	options: [
		{
			type: Options.String,
			name: 'code',
			description: 'The code to evaluate.',
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
		const ts = options.getString('code', true);
		const files: FileOptions[] = [];

		await interaction.deferReply({ ephemeral });
		const embed = new MessageEmbed()
			.setTitle('Eval result')
			.addField('Input', '```ts\n' + ts + '\n```');

		try {
			const transpiled = transpileModule(ts, {
				reportDiagnostics: true,
				compilerOptions: { noEmitOnError: true, target: ScriptTarget.ESNext },
			});
			if (transpiled.diagnostics?.length) {
				throw new Error(
					transpiled.diagnostics
						.map((d) => `${d.start}: ${d.messageText}`)
						.join('\n'),
				);
			}
			const js = transpiled.outputText;
			embed.addField('Transpiled input', '```js\n' + js + '\n```');
			let result = await eval(js);
			let encoding = '```js\n';

			if (typeof result === 'object') {
				result = JSON.stringify(result, null, 2);
				encoding = '```json\n';
			}

			embed
				.setFooter('Status: Success')
				.setColor('GREEN');

			if (result.length < 1000) {
				embed.addField('Output', encoding + result + '\n```');
			}
			else {
				embed.addField('Output', 'See the attachment to view the output.');
				files.push({
					attachment: Buffer.from(<string>result),
					name: `output.${encoding.includes('json') ? 'json' : 'txt'}`,
				});
			}
		}
		catch (e) {
			embed
				.addField('Error', '```js\n' + e + '\n```')
				.setFooter('Status: Failed')
				.setColor('RED');
		}
		await interaction.followUp({
			embeds: [embed],
		});
		if (files.length) {
			await interaction.followUp({
				files,
			});
		}
	},
};
