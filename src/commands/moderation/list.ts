/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'list',
	description: 'Utility moderation command.',
	options: [
		{
			type: Options.Subcommand,
			name: 'modnicks',
			description: 'List members with moderated nicknames.',
		},
		{
			type: Options.Subcommand,
			name: 'unpingable',
			description: 'List members with potentially unpingable nicknames.',
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'MANAGE_MESSAGES',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const sub = options.getSubcommand(true);
		if (!interaction.guild) return;
		await interaction.guild.members.fetch();
		const { cache: members } = interaction.guild.members;

		if (sub === 'modnicks') {
			const matches = members.filter((m) => m.displayName.startsWith('Moderated Nickname')).map((m) => m.toString());
			const embed = new MessageEmbed({
				title: 'Moderated Nicknames',
				description: `${matches.length} moderated nicknames found:\n\n${matches.join('\n')}`,
				color: 'BLURPLE',
			});
			await interaction.reply({ embeds: [embed] });
		}

		if (sub === 'unpingable') {
			const regex = /[^\x00-\x7F]+/i;
			const matches = members.filter((m) => regex.test(m.displayName)).map((m) => m.toString());
			const embed = new MessageEmbed({
				title: 'Unpingable Nicknames',
				description: `${matches.length} potentially unpingable nicknames found:\n\n${matches.join('\n')}`,
				color: 'BLURPLE',
			});
			await interaction.reply({ embeds: [embed] });
		}
	},
};
