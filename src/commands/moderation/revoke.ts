/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'revoke',
	description: 'Removes one or more punishments.',
	options: [
		{
			type: Options.Subcommand,
			name: 'one',
			description: 'Remove a punishment, given its punishment ID.',
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
		},
		{
			type: Options.Subcommand,
			name: 'where',
			description: 'Remove a subset of a user\'s punishments, given search parameters.',
			options: [
				{
					name: 'user',
					description: 'The user to remove punishments of.',
					type: Options.User,
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason for removing these punishments.',
					type: Options.String,
					required: true,
				},
				{
					name: 'type',
					description: 'Only remove punishments of a specified type.',
					type: Options.String,
					choices: [
						{ name: 'Warn', value: 'Warn' },
						{ name: 'Mute', value: 'Mute' },
						{ name: 'Unmute', value: 'Unmute' },
						{ name: 'Ban', value: 'Ban' },
						{ name: 'Unban', value: 'Unban' },
						{ name: 'Moderated Nickname', value: 'Moderated Nickname' },
						{ name: 'Changed Nickname', value: 'Changed Nickname' },
						{ name: 'Warn', value: 'Warn' },
						{ name: 'Blacklist', value: 'Blacklist' },
						{ name: 'Unblacklist', value: 'Unblacklist' },
					],
				},
				{
					name: 'not-type',
					description: 'Exclude punishments of a specified type.',
					type: Options.String,
					choices: [
						{ name: 'Warn', value: 'Warn' },
						{ name: 'Mute', value: 'Mute' },
						{ name: 'Unmute', value: 'Unmute' },
						{ name: 'Ban', value: 'Ban' },
						{ name: 'Unban', value: 'Unban' },
						{ name: 'Moderated Nickname', value: 'Moderated Nickname' },
						{ name: 'Changed Nickname', value: 'Changed Nickname' },
						{ name: 'Warn', value: 'Warn' },
						{ name: 'Blacklist', value: 'Blacklist' },
						{ name: 'Unblacklist', value: 'Unblacklist' },
					],
				},
				{
					name: 'staff',
					description: 'Remove by a specific moderator.',
					type: Options.User,
				},
				{
					name: 'not-staff',
					description: 'Exclude punishments by a specific moderator.',
					type: Options.User,
				},
				{
					name: 'reason-includes',
					description: 'Search for a string inside the punishments\'s reason.',
					type: Options.String,
				},
				{
					name: 'active',
					description:
				'Only remove active/already expired punishments. Excludes punishments that lack this indicator.',
					type: Options.Boolean,
				},
			],
		},
		{
			type: Options.Subcommand,
			name: 'all',
			description: 'Unconditionally remove all punishments a user has.',
			options: [
				{
					type: Options.User,
					name: 'user',
					description: 'The user to remove all punishments from.',
					required: true,
				},
				{
					type: Options.String,
					name: 'reason',
					description: 'The reason for removing these punishments.',
					required: true,
				},
			],
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
		if (!client.user) return;
		const logChannel: TextChannel = client.channels.cache.get(
			'851883465364078632',
		) as TextChannel;
		const webhooks = await logChannel.fetchWebhooks();
		const webhook = webhooks.size
			? webhooks.first()
			: await logChannel.createWebhook(client.user.username, {
				avatar: client.user.avatarURL() ?? undefined,
			});
		const sub = options.getSubcommand(true);
		const reason = options.getString('reason', true);
		if (sub === 'one') {
			const punishID = options.getString('punish-id', true);
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
					const logEmbed = new MessageEmbed()
						.setTitle('Punishment Removed')
						.addField('Removed For', reason)
						.addField('Type', log.caseType)
						.addField('Moderator', `<@${log.staffID}> (${log.staffID})`)
						.addField('User', `<@${log.userID}> (${log.userID})`)
						.addField('Reason', log.reason)
						.addField('Punishment ID', `\`${log.punishID}\``)
						.setColor('RANDOM')
						.setFooter(
							`Deleted by: ${interaction.user.tag} (${interaction.user.id})`,
						);
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
			return;
		}
		// We'll combine the other two cases into one
		const user = options.getUser('user', true);
		const notType = options.getString('not-type');
		const type = options.getString('type');
		const notStaff = options.getUser('not-staff');
		const staff = options.getUser('staff');
		const reasonIncludes = options.getString('reason-includes');
		const active = options.getBoolean('active');
		const logs = (await client.modlogs.getUser(user.id)).filter((l) => {
			return ![
				type ? l.caseType === type : undefined,
				notType ? l.caseType !== notType : undefined,
				staff ? l.staffID === staff.id : undefined,
				notStaff ? l.staffID !== notStaff.id : undefined,
				reasonIncludes
					? l.reason.toLowerCase().includes(reasonIncludes.toLowerCase())
					: undefined,
				active ? l.isActive === active : undefined,
			].includes(false);
		});
		if (!logs.length) {
			return interaction.reply({
				embeds: [fail(sub === 'all' ? 'I couldn\'t find any punishments for this user!' : 'I couldn\'t find any punishments matching your filters!')],
				ephemeral: true,
			});
		}
		await confirm(
			interaction,
			`Are you sure you want to remove these \`${logs.length}\` punishments?\n\`${logs.map((l) => l.punishID).join(', ')}\``,
		)
			.then(async () => {
				client.modlogs.deleteMany(logs.map((l) => l.punishID));
				const logEmbed = new MessageEmbed()
					.setTitle('Punishments Removed')
					.addField('Removed for', reason)
					.addField('Removed amount', `${logs.length}`)
					.addField('Punishment IDs', '`' + logs.map((l) => l.punishID).join(', ') + '`')
					.addField('User', `<@${user.id}> (${user.id})`)
					.setColor('RANDOM')
					.setFooter(
						`Deleted by: ${interaction.user.tag} (${interaction.user.id})`,
					);
				await webhook?.send({
					embeds: [logEmbed],
					username: client.user.username,
					avatarURL: client.user.avatarURL() ?? undefined,
				});
				await interaction.editReply({
					embeds: [success(`Deleted ${sub === 'all' ? 'all ' : ''} \`${logs.length}\`punishments for ${user}.`)],
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
