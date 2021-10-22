/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Collection, GuildMember, MessageEmbed, Permissions, EmbedFieldData } from 'discord.js';
import { success, fail, confirm, parsePages, pageMenu } from '../../structures/embeds';
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
		const title = {
			modnicks: 'Moderated Nicknames',
			unpingable: 'Potentially Unpingable Nicknames',
		}[sub];
		let matches: Collection<string, GuildMember>;
		let fields: EmbedFieldData[];

		if (sub === 'modnicks') {
			matches = members.filter((m) => m.displayName.startsWith('Moderated Nickname'));
			fields = matches.map((m) => {
				return {
					name: `${m.user.tag}`,
					value: m.user.id,
				};
			});
		}

		if (sub === 'unpingable') {
			matches = members.filter((m) => /[^\x00-\x7F]+/i.test(m.displayName));
			fields = matches.map((m) => {
				return {
					name: `${m.displayName} (${m.user.tag})`,
					value: m.user.id,
				};
			});
		}
		if (!fields.length) {
			return interaction.reply({ embeds: [fail(`No ${title.toLowerCase()} found.`)] });
		}
		const embeds = parsePages(fields, new MessageEmbed({
			title,
			description: `${fields.length} ${title.toLowerCase()} found.`,
			color: 'BLURPLE',
		}));
		await pageMenu(interaction, embeds);
	},
};
