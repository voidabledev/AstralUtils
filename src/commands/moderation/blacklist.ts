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
	name: 'blacklist',
	description: 'Blocks a user from using any commands, participating in giveaways, and using modmail.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to blacklist.',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reason for this blacklist.',
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
		if (member?.permissions.has('ADMINISTRATOR')) {
			return interaction.reply({
				embeds: [fail('You can\'t blacklist an admin!')],
			});
		}
		const [blacklist] = await client.modlogs.fetch({ userID: user.id, caseType: 'Blacklist', isActive: true });
		if (blacklist) {
			return interaction.reply({
				embeds: [fail(`${user} is already blacklisted for \`${blacklist.reason}\`!`)],
			});
		}
		await confirm(interaction, `Are you sure you want to blacklist ${user}?`, true)
			.then(async () => {
				const userEmbed = new MessageEmbed()
					.setAuthor(
						user.tag,
						user.displayAvatarURL({ dynamic: true, size: 512 }),
					)
					.setTitle(`You were blacklisted in ${interaction.guild?.name}`)
					.addField('Reason', reason)
					.setColor('RED');
				await user
					.send({
						embeds: [userEmbed],
					})
					.catch(() => null);
				const log = await client.modlogs.set({
					guildID: (interaction.guild as Guild).id,
					userID: user.id,
					staffID: interaction.user.id,
					reason,
					caseType: 'Blacklist',
					isActive: true,
				});
				await interaction.editReply({
					content: `Successfully blacklisted ${user}.`,
					components: [],
				});
				await interaction.channel.send({
					embeds: [success(`${user} has been blacklisted with case id \`${log.punishID}\`.`)],
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
