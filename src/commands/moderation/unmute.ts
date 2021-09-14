/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed, Permissions, Guild, GuildMember } from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'unmute',
	description: 'Unmutes a user.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to unmute.',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reason for this unmute',
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
		const reason = options.getString('reason', true);
		if (typeof member === 'undefined') {
			return interaction.reply({
				embeds: [fail('I can\'t unmute someone not in the server.')],
			});
		}
		const role = interaction.guild?.roles.cache.find((r) => r.name === 'Muted');
		if (typeof role === 'undefined') {
			return interaction.reply({
				embeds: [fail('I was unable to find a "Muted" role.')],
			});
		}
		if (!member?.manageable) {
			return interaction.reply({
				embeds: [fail('I can\'t manage this user!')],
			});
		}
		if (!member.roles.cache.has(role.id)) {
			return interaction.reply({
				embeds: [fail(`${member} isn't muted!`)],
			});
		}
		await confirm(interaction, `Are you sure you want to unmute ${member}?`)
			.then(async () => {
				const userEmbed = new MessageEmbed()
					.setAuthor(interaction.user.tag, member.user.displayAvatarURL({ dynamic: true, size: 512 }))
					.setTitle(`You were unmuted in **${interaction.guild?.name}**`)
					.addField('Reason', reason)
					.setColor('GREEN');
				await member.user
					.send({
						embeds: [userEmbed],
					})
					.catch(() => null);
				await member.roles.remove(role);
				const log = await client.modlogs.set({
					guildID: (interaction.guild as Guild).id,
					userID: member.id,
					staffID: interaction.user.id,
					reason,
					caseType: 'Unmute',
				});
				await interaction.editReply({
					embeds: [success(`${member} has been unmuted | \`${log.punishID}\`.`)],
					components: [],
				});
				await client.modlogs.updateOne(
					{ caseType: 'Mute', userID: member.id, isActive: true },
					{ isActive: false },
				);
			})
			.catch(() => {
				interaction.editReply({
					embeds: [fail('Cancelled.')],
					components: [],
				});
			});
	},
};
