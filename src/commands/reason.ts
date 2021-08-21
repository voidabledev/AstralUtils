/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../typings/command';
import { MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { success, fail, confirm } from '../modules/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'reason',
	description: 'Change a punishment\'s reason.',
	options: [
		{
			type: Options.String,
			name: 'punish-id',
			description: 'The punishment\'s ID',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The new reason for this punishment.',
			required: true,
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'MANAGE_ROLES',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const punishID = options.getString('punish-id', true);
		const reason = options.getString('reason', true);
		const log = await client.modlogs.update(punishID, { reason });
		if (!log) {
			return interaction.reply({
				embeds: [fail('I couldn\'t find a punishment with this ID!')],
			});
		}
		await interaction.reply({
			embeds: [
				success(
					`Changed the reason of punishment \`${punishID}\` from \`${log.reason}\` to \`${reason}\`.`,
				),
			],
		});
	},
};
