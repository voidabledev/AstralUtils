/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	MessageEmbed,
	Permissions,
	Guild,
} from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'unblacklist',
	description: 'Lifts a previously applied user block.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to unblacklist.',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reason for this unblacklist.',
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
		const user = options.getUser('user', true);
		const reason = options.getString('reason', true);
		const member = await interaction.guild?.members.fetch(user.id);
		const [blacklist] = await client.modlogs.fetch({ userID: user.id, caseType: 'Blacklist', isActive: true });
		if (!blacklist) {
			return interaction.reply({
				embeds: [fail(`${user} isn't blacklisted!`)],
			});
		}
		await confirm(interaction, `Are you sure you want to unblacklist ${user}?`)
			.then(async () => {
				const log = await client.modlogs.set({
					guildID: (interaction.guild as Guild).id,
					userID: user.id,
					staffID: interaction.user.id,
					reason,
					caseType: 'Unblacklist',
				});
				const userEmbed = new MessageEmbed()
					.setAuthor(
						'Astral Moderation',
						client.user.displayAvatarURL({ dynamic: true, size: 512 }),
					)
					.setTitle(`You were unblacklisted in ${interaction.guild?.name}!`)
					.addField('Reason', reason)
					.setFooter(`Punishment ID: ${log.punishID}`)
					.setColor('GREY');
				await member.user
					.send({
						embeds: [userEmbed],
					})
					.catch(() => null);
				await client.modlogs.update(blacklist.punishID, { isActive: false, expires: new Date().getTime() });
				await interaction.editReply({
					embeds: [success(`${user} has been unblacklisted | \`${log.punishID}\`.`)],
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
