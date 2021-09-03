/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	MessageEmbed,
	Permissions,
	Guild,
	GuildMember,
	GuildMemberRoleManager,
} from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
// eslint-disable-next-line @typescript-eslint/no-empty-function

export const command: Command = {
	name: 'nick',
	description: 'Changes a user\'s nickname.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to change the nickname of.',
			required: true,
		},
		{
			type: Options.String,
			name: 'new-nick',
			description: 'The new nickname.',
			required: true,
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
		const member = options.getMember('user') as GuildMember | undefined;
		const newNick = options.getString('new-nick', true);
		const oldNick = member?.displayName;
		if (typeof member === 'undefined') {
			return interaction.reply({
				embeds: [
					fail(
						'The user you specified isn\'t in this server, I can\'t change their nickname.',
					),
				],
			});
		}
		if (
			member.roles.highest.position >=
			(interaction.member?.roles as GuildMemberRoleManager).highest.position
		) {
			return interaction.reply({
				embeds: [fail('You can\'t change the nickname of somebody above you!')],
			});
		}
		member
			.setNickname(newNick)
			.then(async () => {
				const log = await client.modlogs.set({
					userID: member.id,
					guildID: member.guild.id,
					staffID: interaction.user.id,
					reason: `${oldNick} -> ${newNick}`,
					caseType: 'Changed Nickname',
				});
				await interaction.reply({
					embeds: [
						success(
							`Changed ${member}'s nickname to \`${newNick}\` | \`${log.punishID}\``,
						),
					],
				});
			})
			.catch((e) =>
				interaction.reply({
					embeds: [
						fail(`I was unable to change ${member}'s nickname: ${e.message}`),
					],
				}),
			);
	},
};
