/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Permissions, Guild } from 'discord.js';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { success, fail, confirm } from '../../structures/embeds';

export const command: Command = {
	name: 'unban',
	description: 'Unbans a user.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to unban.',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reason for this unban.',
			required: true,
		},
	],
	async allowed(interaction, client) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'BAN_MEMBERS',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const user = options.getUser('user', true);
		const reason = options.getString('reason', true);
		if (
			!(await interaction.guild?.bans.fetch())?.find(
				(b) => b.user.id === user.id,
			)
		) {
			return interaction.reply({
				content: 'That user isn\'t banned!',
				ephemeral: true,
			});
		}
		await confirm(interaction, `Are you sure you want to unban ${user}?`)
			.then(async () => {
				await interaction.guild?.members.unban(user, reason);
				const log = await client.modlogs.set({
					guildID: (interaction.guild as Guild).id,
					userID: user.id,
					staffID: interaction.user.id,
					reason,
					caseType: 'Unban',
				});
				await interaction.editReply({
					embeds: [success(`${user} has been unbanned with case id \`${log.punishID}\`.`)],
					components: [],
				});
			})
			.catch(() => {
				interaction.editReply({
					embeds: [fail('Cancelled.')],
					components: [],
				});
			});
	},
};
