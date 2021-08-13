import { Command } from '../Typings/Command';
import { MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { success, fail, confirm } from '../Modules/Embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
// eslint-disable-next-line @typescript-eslint/no-empty-function

export const command: Command = {
	name: 'duration',
	description: 'Change a punishment\'s duration.',
	options: [
		{
			type: Options.String,
			name: 'punish-id',
			description: 'The punishment\'s ID',
			required: true,
		},
		{
			type: Options.Integer,
			name: 'time',
			description: 'The new expiration time.',
		},
		{
			type: Options.Integer,
			name: 'time-unit',
			description: 'The time unit to specify the expiration time in.',
			choices: [
				{ name: 'Minute(s)', value: 1000 * 60 },
				{ name: 'Hour(s)', value: 1000 * 60 * 60 },
				{ name: 'Day(s)', value: 1000 * 60 * 24 },
			],
		},
	],
	async allowed(interaction, client) {
		return (interaction.guild && (interaction.member?.permissions as Readonly<Permissions>)?.has?.('MANAGE_ROLES')) ?? false;
	},
	async run(interaction, options, client) {

		const punishID = options.getString('punish-id', true);
		const expires = new Date().getTime() +
			options.getInteger('time', true) * options.getInteger('time-unit', true);
		const log = await client.modlogs.update(punishID, { expires });

		if (!log) {
			return interaction.reply({
				embeds: [fail('I couldn\'t find a punishment with this ID!')],
			});
		}
		await interaction.reply({
			embeds: [success(`The punishment with ID \`${punishID}\` now expires <t:${Math.floor(expires / 1000)}:R>.`)],
		});
	},
};
