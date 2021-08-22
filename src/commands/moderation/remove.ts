/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { success, fail, confirm } from '../../modules/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'remove',
	description: 'Removes a punishment.',
	options: [
		{
			type: Options.String,
			name: 'punish-id',
			description: 'The punishment\'s ID',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reason for removing this punishment.',
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
		const punishID = options.getString('punish-id', true);
		const reason = options.getString('reason', true);
		const log = await client.modlogs.get(punishID);
		if (!log) {
			return interaction.reply({
				embeds: [fail('I couldn\'t find a punishment with this ID!')],
			});
		}
		await confirm(
			interaction,
			`Are you sure you want to remove this punishment?\n\n**Type:** ${log.caseType}\n**Moderator:** <@${log.staffID}> (${log.staffID})\n**User:** <@${log.userID}> (${log.userID})\n**Reason:** ${log.reason}`,
		)
			.then(async () => {
				await client.modlogs.delete(punishID);
				await interaction.editReply({
					embeds: [
						success(`Removed punishment \`${punishID}\` for \`${reason}\`.`),
					],
					components: [],
				});
				if (!client.user) return;
				const logChannel: TextChannel = client.channels.cache.get(
					'851883465364078632',
				) as TextChannel;
				const logEmbed = new MessageEmbed()
					.setTitle('Punishment Removed')
					.addField('Removed For', reason)
					.addField('Type', log.caseType)
					.addField('Moderator', `<@${log.staffID}> (${log.staffID})`)
					.addField('User', `<@${log.userID}> (${log.userID})`)
					.addField('Reason', log.reason)
					.setColor('RANDOM')
					.setFooter(
						`Deleted by: ${interaction.user.tag} (${interaction.user.id})`,
					);
				const webhooks = await logChannel.fetchWebhooks();
				const webhook = webhooks.size
					? webhooks.first()
					: await logChannel.createWebhook(client.user.username, {
						avatar: client.user.avatarURL() ?? undefined,
					});
				webhook?.send({
					username: client.user.username,
					avatarURL: client.user.avatarURL() ?? undefined,
					embeds: [logEmbed],
				});
			})
			.catch(async () => {
				await interaction.editReply({
					embeds: [fail('Cancelled.')],
					components: [],
				});
			});
	},
};
