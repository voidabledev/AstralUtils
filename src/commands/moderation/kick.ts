/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	MessageEmbed,
	Permissions,
	Guild,
	GuildMemberRoleManager,
} from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'kick',
	description: 'Kicks a user.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to kick.',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reason for this kick',
			required: true,
		},
	],
	async allowed(interaction) {
		return (
			(interaction.guild &&
				(interaction.member?.permissions as Readonly<Permissions>)?.has?.(
					'KICK_MEMBERS',
				)) ??
			false
		);
	},
	async run(interaction, options, client) {
		const user = options.getUser('user', true);
		const reason = options.getString('reason', true);
		const member = await interaction.guild?.members.fetch(user.id).catch((): undefined => undefined);
		if (member?.kickable === false) {
			return interaction.reply({
				embeds: [fail('I can\'t kick this user!')],
			});
		}
		if (typeof member === 'undefined') {
			return interaction.reply({
				embeds: [fail('That user isn\'t in this server, I can\'t kick them.')],
			});
		}
		if (
			(member?.roles?.highest?.position ?? 0) >=
			(interaction.member?.roles as GuildMemberRoleManager).highest.position
		) {
			return interaction.reply({
				embeds: [fail('You can\'t kick a user above you!')],
			});
		}
		await confirm(interaction, `Are you sure you want to kick ${user}?`)
			.then(async () => {
				const log = await client.modlogs.set({
					guildID: (interaction.guild as Guild).id,
					userID: user.id,
					staffID: interaction.user.id,
					reason,
					caseType: 'Kick',
					isActive: true,
				});
				const userEmbed = new MessageEmbed()
					.setAuthor(
						'Astral Moderation',
						client.user.displayAvatarURL({ dynamic: true, size: 512 }),
					)
					.setTitle(`You were kicked in ${interaction.guild?.name}!`)
					.addField('Reason', reason)
					.setFooter(`Punishment ID: ${log.punishID}`)
					.setColor('RED');
				await user
					.send({
						embeds: [userEmbed],
					})
					.catch(() => null);
				await interaction.guild?.members.kick(user, reason);
				await interaction.editReply({
					embeds: [success(`${user} has been kicked | \`${log.punishID}\`.`)],
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
