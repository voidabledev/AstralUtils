/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import {
	MessageEmbed,
	Permissions,
	Guild,
	GuildMember,
	Role,
} from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';

export const command: Command = {
	name: 'mute',
	description: 'Mutes a user.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to mute.',
			required: true,
		},
		{
			type: Options.String,
			name: 'reason',
			description: 'The reason for this mute',
			required: true,
		},
		{
			type: Options.Integer,
			name: 'time',
			description: 'The time after which this mute expires, if any.',
		},
		{
			type: Options.Integer,
			name: 'time-unit',
			description: 'The time unit to specify the expiration time in.',
			choices: [
				{ name: 'Minute(s)', value: 1000 * 60 },
				{ name: 'Hour(s)', value: 1000 * 60 * 60 },
				{ name: 'Day(s)', value: 1000 * 60 * 24 },
			],
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
		const time = options.getInteger('time');
		const timeUnit = options.getInteger('time-unit') ?? 60000;
		if (typeof member === 'undefined') {
			return interaction.reply({
				embeds: [fail('I can\'t mute someone not in the server.')],
			});
		}
		if (member.permissions.has('MANAGE_MESSAGES')) {
			return interaction.reply({
				embeds: [fail('You can\'t mute a moderator/admin!')],
			});
		}
		let role = interaction.guild?.roles.cache.find((r) => r.name === 'Muted');
		const createRole = typeof role === 'undefined';
		if (!member?.manageable) {
			return interaction.reply({
				embeds: [fail('I can\'t mute this user!')],
			});
		}
		if (role && member.roles.cache.has(role.id)) {
			return interaction.reply({
				embeds: [fail(`${member} is already muted!`)],
			});
		}
		await confirm(
			interaction,
			`Are you sure you want to mute ${member}? ${
				createRole ? 'A "Muted" role will be created' : ''
			}`,
		)
			.then(async () => {
				if (createRole) {
					role = await (interaction.guild as Guild).roles.create({
						name: 'Muted',
						color: '#818386',
						hoist: false,
					});
					interaction.guild?.channels.cache.each((c) => {
						if (
							c.type === 'GUILD_TEXT' ||
							c.type === 'GUILD_CATEGORY' ||
							c.type === 'GUILD_NEWS'
						) {
							c.permissionOverwrites.create(role as Role, {
								VIEW_CHANNEL: false,
								SEND_MESSAGES: false,
								READ_MESSAGE_HISTORY: false,
								ADD_REACTIONS: false,
								USE_PUBLIC_THREADS: false,
								USE_PRIVATE_THREADS: false,
							});
						}
						if (c.type === 'GUILD_VOICE' || c.type === 'GUILD_STAGE_VOICE') {
							c.permissionOverwrites.create(role as Role, {
								CONNECT: false,
								SPEAK: false,
							});
						}
					});
				}
				const userEmbed = new MessageEmbed()
					.setAuthor(
						member.user.tag,
						member.user.displayAvatarURL({ dynamic: true, size: 512 }),
					)
					.setTitle(`You were muted in **${interaction.guild?.name}**`)
					.addField(
						'Expires',
						time
							? `<t:${Math.floor(
								(new Date().getTime() + time * timeUnit) / 1000,
							)}:f> (<t:${Math.floor(
								(new Date().getTime() + time * timeUnit) / 1000,
							)}:R>)`
							: 'Permanent',
					)
					.addField('Reason', reason)
					.setColor('ORANGE');
				await member.user
					.send({
						embeds: [userEmbed],
					})
					.catch(() => null);
				await member.roles.add(role as Role);
				const log = await client.modlogs.set({
					guildID: (interaction.guild as Guild).id,
					userID: member.id,
					staffID: interaction.user.id,
					reason,
					caseType: 'Mute',
					expires: time ? new Date().getTime() + time * timeUnit : undefined,
					isActive: true,
				});
				await interaction.editReply({
					embeds: [
						success(`${member} has been **muted** | \`${log.punishID}\``),
					],
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
