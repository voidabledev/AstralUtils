/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	Permissions,
	GuildMember,
	GuildMemberRoleManager,
} from 'discord.js';
import { success, fail, confirm } from '../../modules/embeds';
import { id } from '../../modules/utils';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'moderate',
	description: 'Moderates a user\'s nickname.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to moderate the nickname of.',
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
		const newNick = `Moderated Nickname ${id(36, 6)}`;
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
		if (member.displayName.startsWith('Moderated Nickname')) {
			return interaction.reply({
				embeds: [fail('That user\'s nickname is already moderated!')],
			});
		}
		member
			.setNickname(newNick)
			.then(async () => {
				const log = await client.modlogs.set({
					userID: member.id,
					guildID: member.guild.id,
					staffID: interaction.user.id,
					reason: 'Rule 10',
					caseType: 'Moderated Nickname',
				});
				await interaction.reply({
					embeds: [
						success(`Moderated ${member}'s nickname | \`${log.punishID}\``),
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
