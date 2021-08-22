/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	MessageEmbed,
	Permissions,
	Guild,
	GuildMember,
	GuildMemberRoleManager,
} from 'discord.js';
import { success, fail, confirm } from '../../modules/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
// eslint-disable-next-line @typescript-eslint/no-empty-function

export const command: Command = {
	name: 'say',
	description: 'Announce something.',
	options: [
		{
			type: Options.String,
			name: 'message',
			description: 'The message to announce.',
			required: true,
		},
		{
			type: Options.Boolean,
			name: 'anonymous',
			description: 'Whether or not to hide your username.',
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'ADMINISTRATOR',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const message = options.getString('message', true);
		const anon = options.getBoolean('anonymous') ?? false;
		const author = anon && client.user ? client.user : interaction.user;
		const embed = new MessageEmbed()
			.setAuthor(
				author.username,
				author.avatarURL({ dynamic: true }) ?? undefined,
			)
			.setDescription(message)
			.setFooter(
				anon
					? 'Astral Galaxy Management Team'
					: `Sent by: ${interaction.user.tag}`,
			);
		await interaction.reply({ embeds: [embed] });
	},
};
