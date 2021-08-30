/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { success, fail, confirm } from '../../modules/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'wipe',
	description: 'Removes all punishments a user has.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to wipe punishments for.',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reason for removing punishments.',
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
		const logs = await client.modlogs.getUser(user.id);
		if (!logs.length) {
			return interaction.reply({
				embeds: [fail('I found no punishments to remove!')],
			});
		}
		await confirm(
			interaction,
			`Are you sure you want to delete all \`${logs.length}\` punishments for ${user}?`,
		)
			.then(async () => {
				await client.modlogs.deleteMany(logs.map((l) => l.punishID));
				await interaction.editReply({
					embeds: [
						success(
							`Removed \`${logs.length}\` punishments for \`${reason}\`.`,
						),
					],
					components: [],
				});
				if (!client.user) return;
				const logChannel: TextChannel = client.channels.cache.get(
					'851883465364078632',
				) as TextChannel;
				const logEmbed = new MessageEmbed()
					.setTitle('Punishments Removed')
					.addField('Removed for', reason)
					.addField('Removed amount', `${logs.length}`)
					.addField('User', `<@${user.id}> (${user.id})`)
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
